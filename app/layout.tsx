import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'miniMatch',
  description: 'AI-powered matching system for talent and projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
