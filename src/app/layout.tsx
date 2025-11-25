import type { Metadata } from 'next';
import './globals.css';
import { TRPCProvider } from '@/components/providers/TRPCProvider';

export const metadata: Metadata = {
  title: 'Oviya - The AI Friend Who Gets You',
  description:
    'An emotionally intelligent AI companion that understands your language, culture, and feelings. Chat with Oviya - your AI best friend.',
  keywords: ['AI', 'companion', 'friend', 'chat', 'emotional support', 'multilingual'],
  authors: [{ name: 'Oviya Team' }],
  openGraph: {
    title: 'Oviya - The AI Friend Who Gets You',
    description: 'An emotionally intelligent AI companion that actually understands you.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
