import type { Metadata } from 'next';
import Link from 'next/link';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';

// Self-hosted via next/font at build time — no runtime requests to Google.
const sans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'Mattia Callegher — Frontend Developer & QA Engineer',
    template: '%s — Mattia Callegher',
  },
  description:
    'Frontend developer & QA engineer. React, Next.js, TypeScript, Playwright. Based in Italy, looking towards Japan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="flex min-h-dvh flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-baseline justify-between px-6 pb-4 pt-8 sm:px-10">
          <Link href="/" className="font-semibold tracking-tight">
            Mattia Callegher
          </Link>
          <nav className="flex gap-5 text-sm sm:gap-7" style={{ color: 'var(--muted-foreground)' }}>
            <Link href="/playground/" className="hover:underline">
              Playground
            </Link>
            <Link href="/colophon/" className="hover:underline">
              Colophon
            </Link>
            <a href="/cv.pdf" className="hover:underline">
              CV ↓
            </a>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-10 sm:py-14">{children}</main>

        <footer
          className="mx-auto w-full max-w-6xl border-t px-6 py-8 text-sm sm:px-10"
          style={{ borderColor: 'var(--secondary-darker)', color: 'var(--muted-foreground)' }}
        >
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-2">
            <span>Mattia Callegher · Italy</span>
            <span className="flex gap-5">
              <a href="mailto:callegher.mattia00@gmail.com" className="hover:underline">
                Email
              </a>
              <a href="https://github.com/Calle097" className="hover:underline">
                GitHub
              </a>
              <a href="https://github.com/Calle097/MySite" className="hover:underline">
                Source
              </a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
