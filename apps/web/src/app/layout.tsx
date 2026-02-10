import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Notely - Your Notes App',
  description: 'A modern notes and workspace application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
