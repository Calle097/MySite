# Deploying to the VPS — full walkthrough

One-time server setup, then every `git push` to `main` deploys automatically.

The flow:

```
git push → GitHub Actions: pnpm build → rsync out/ → VPS:/srv/mysite/site → Caddy serves it
```

The VPS never runs Node — it only runs Caddy serving static files, which is
why 1 vCPU / 1 GB is plenty.

## 1. Harden the server (once)

SSH in as root (Aruba gives you root + password at first):

```bash
# create your admin user
adduser calle
usermod -aG sudo calle

# put your public key on it (paste your ~/.ssh/id_ed25519.pub)
mkdir -p /home/calle/.ssh
nano /home/calle/.ssh/authorized_keys
chown -R calle:calle /home/calle/.ssh && chmod 700 /home/calle/.ssh && chmod 600 /home/calle/.ssh/authorized_keys
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
sudo usermod -aG docker calle   # re-login to take effect
```

## 3. Create the deploy user + directory (once)

CI gets its own restricted user, so a leaked CI key can only touch the site files:

```bash
sudo adduser --disabled-password deploy
sudo mkdir -p /srv/mysite/site
sudo chown -R deploy:deploy /srv/mysite/site
```

Generate a **dedicated** keypair on your PC (not your personal key):

```powershell
ssh-keygen -t ed25519 -f mysite_deploy_key -C "mysite-ci"
```

Public half → server: append `mysite_deploy_key.pub` to
`/home/deploy/.ssh/authorized_keys` (create the dir like in step 1, owner `deploy`).
Private half → GitHub repo → Settings → Secrets and variables → Actions:

| Secret        | Value                                   |
| ------------- | --------------------------------------- |
| `VPS_HOST`    | server public IP                        |
| `VPS_USER`    | `deploy`                                |
| `VPS_SSH_KEY` | contents of `mysite_deploy_key` (private) |

Delete the local copy of the private key after pasting it.

## 4. Caddy (once)

Copy `deploy/docker-compose.yml` and `deploy/Caddyfile` to `/srv/mysite/` on
the server, put your real domain in the Caddyfile, then:

```bash
cd /srv/mysite && docker compose up -d
```

## 5. DNS on Cloudflare

1. Add an `A` record: `@` → VPS IP, and `CNAME`: `www` → `@`.
2. **Start with the grey cloud (DNS only)** so Caddy can get its Let's Encrypt
   certificate via HTTP challenge.
3. Once `https://yourdomain.com` works, flip both records to the orange cloud
   (proxied) and set SSL/TLS mode to **Full (strict)**.

> Note: with the orange cloud on, future automatic cert *renewals* via HTTP
> challenge usually still work (Cloudflare passes `/.well-known/acme-challenge`
> through), but if a renewal ever fails, the fix is the Caddy Cloudflare DNS
> plugin — ask me and we'll switch to it.

## 6. First deploy

```bash
git push origin main
```

Watch it under the repo's **Actions** tab. When it's green, the site is live.
Rollback = revert the commit and push; CI redeploys the previous state.

## Bots & abuse

- Cloudflare (orange cloud): hides the origin IP, absorbs basic floods, and
  its free Bot Fight Mode can be enabled in the dashboard.
- Caddy serves only static files — there is nothing to inject into or brute-force.
- SSH is key-only, root login off, and the CI key can only write site files.
- Optional later: restrict ports 80/443 to Cloudflare's IP ranges in ufw.

## Analytics (later, if wanted)

Keep it self-hosted and cookie-free so the colophon stays honest: run
[Umami](https://umami.is) or Plausible CE as a second container in the same
compose file, expose it on `stats.yourdomain.com` via Caddy, and add its one
`<script>` tag to `app/layout.tsx`. Both fit fine in 1 GB alongside Caddy
(they need a small Postgres, also containerized). Say the word and it can be
added to the compose + Caddyfile.

## Updating dependencies (npm-worm era)

Versions are pinned exactly and `.npmrc` disables lifecycle scripts. To update:
bump versions deliberately, check the version's publish date and age
(`npm view <pkg>@<ver> time`), prefer versions at least a week old, reinstall,
and re-audit `pnpm-lock.yaml`.
