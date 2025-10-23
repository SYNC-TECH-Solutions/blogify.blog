
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Embed Test',
  description: 'Testing the blogify.blog embed widget.',
};

export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
