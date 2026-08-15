# Deploying a static Next.js export to a VPS

A generic guide: one-time server setup, then every push to `main` deploys
automatically. Works on any small VPS (1 vCPU / 1 GB is plenty) from any
provider, running Ubuntu LTS or similar.

The flow:

```
git push → GitHub Actions: pnpm build → rsync out/ → VPS:/srv/mysite/site → Caddy serves it
```

The VPS never runs Node — it only runs Caddy serving static files. Never
build on a 1 GB box; `next build` wants more RAM than that.

## 1. Harden the server (once)

SSH in as root (most providers give you root credentials at first):

```bash
# create your admin user
adduser admin
usermod -aG sudo admin

# put your public key on it (paste your ~/.ssh/id_ed25519.pub)
mkdir -p /home/admin/.ssh
nano /home/admin/.ssh/authorized_keys
chown -R admin:admin /home/admin/.ssh && chmod 700 /home/admin/.ssh && chmod 600 /home/admin/.ssh/authorized_keys
```

Then lock SSH down — edit `/etc/ssh/sshd_config`:

```
PermitRootLogin no
PasswordAuthentication no
```

`sudo systemctl restart ssh`. **Test the key login in a second terminal before
closing the root session.**

Firewall:

```bash
sudo apt update && sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 2. Install Docker (once)

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker admin   # re-login to take effect
```

## 3. Create the deploy user + directory (once)

CI gets its own restricted user, so a leaked CI key can only touch the site files:

```bash
sudo adduser --disabled-password deploy
sudo mkdir -p /srv/mysite/site
sudo chown -R deploy:deploy /srv/mysite/site
```

Generate a **dedicated** keypair locally (not your personal key):

```bash
ssh-keygen -t ed25519 -f mysite_deploy_key -C "mysite-ci"
```

Public half → server: append `mysite_deploy_key.pub` to
`/home/deploy/.ssh/authorized_keys` (create the dir like in step 1, owner `deploy`).
Private half → GitHub repo → Settings → Secrets and variables → Actions:

| Secret        | Value                                     |
| ------------- | ----------------------------------------- |
| `VPS_HOST`    | server public IP                          |
| `VPS_USER`    | `deploy`                                  |
| `VPS_SSH_KEY` | contents of `mysite_deploy_key` (private) |

Also add a repository **variable** (same page, Variables tab): `SITE_URL` set to
the canonical origin (e.g. `https://example.com`) — used at build time for
hreflang, sitemap, and OpenGraph URLs.

Delete the local copy of the private key after pasting it.

## 4. Caddy (once)

Copy `deploy/docker-compose.yml` and `deploy/Caddyfile` to `/srv/mysite/` on
the server, put your domain in the Caddyfile, then:

```bash
cd /srv/mysite && docker compose up -d
```

## 5. DNS (Cloudflare or any provider)

1. Add an `A` record: `@` → VPS IP, and `CNAME`: `www` → `@`.
2. If using Cloudflare: **start with the grey cloud (DNS only)** so Caddy can
   get its Let's Encrypt certificate via HTTP challenge.
3. Once HTTPS works, flip both records to the orange cloud (proxied) and set
   SSL/TLS mode to **Full (strict)**.

> With the proxy on, automatic cert renewals via HTTP challenge usually still
> work; if one ever fails, switch Caddy to the DNS challenge (Cloudflare
> plugin).

## 6. First deploy

```bash
git push origin main
```

Watch the repo's **Actions** tab. When it's green, the site is live.
Rollback = revert the commit and push; CI redeploys the previous state.

## Updating the Caddyfile

CI only rsyncs `out/` into `/srv/mysite/site/`. The Caddyfile lives one level
up at `/srv/mysite/Caddyfile` and no deploy ever touches it — the `deploy` user
has no write access outside the site directory, precisely so a leaked CI key
cannot rewrite the server config. `deploy/Caddyfile` in the repo is the
reference copy; changes to it are carried over by hand.

Push the site first, so anything the new config points at is already on disk.
Then, from the repo root:

```bash
scp deploy/Caddyfile admin@YOUR_VPS_IP:/srv/mysite/Caddyfile
ssh admin@YOUR_VPS_IP "cd /srv/mysite && docker compose exec -T caddy caddy validate --adapter caddyfile --config /etc/caddy/Caddyfile"
ssh admin@YOUR_VPS_IP "cd /srv/mysite && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile"
```

No `sudo`, even though `/srv/mysite/` is root-owned: directory ownership
governs creating, renaming and deleting entries, while overwriting an existing
file's *contents* only needs write permission on the file itself. The Caddyfile
is owned by the admin user from step 4, and `scp` truncates in place rather
than replacing the entry. (`sudo mv` would fail here — it renames into the
directory. And `sudo` over a non-interactive `ssh` cannot prompt for a password
at all without `ssh -t`.)

`-T` skips the TTY a non-interactive SSH cannot allocate. `reload` re-validates
before swapping and refuses a broken config, leaving the running one untouched,
so a mistake costs a failed command rather than downtime. Run `validate` first
anyway: it explains *why* a config was rejected, which `reload` does not always
make obvious.

Caddy carries the original status through `handle_errors`, so the rewritten
404 page is served as a real `404` — confirm with `curl -I https://YOUR_DOMAIN/nope/`.

## Bots & abuse

- Cloudflare proxy: hides the origin IP, absorbs basic floods; Bot Fight Mode
  can be enabled in the dashboard.
- Caddy serves only static files — nothing to inject into or brute-force.
- SSH is key-only, root login off, and the CI key can only write site files.
- Optional: restrict ports 80/443 to Cloudflare's published IP ranges.

## Analytics (optional)

To keep a "no tracking" claim honest, prefer self-hosted and cookie-free:
Umami or Plausible CE as a second container in the same compose file, exposed
on a `stats.` subdomain via Caddy, plus one script tag in the site layout.

## Updating dependencies safely

Pin exact versions and keep lifecycle scripts disabled (`.npmrc`). To update:
bump deliberately, check the version's publish date and age
(`npm view <pkg>@<ver> time`), prefer versions at least a week old, reinstall,
and audit the lockfile before committing.
