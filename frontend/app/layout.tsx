import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'TrackPulse',
  description: 'TrackPulse MVP for deterministic audio trend analysis.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="pb-16">{children}</main>
      </body>
    </html>
  );
}
