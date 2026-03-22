import { QueryProvider } from '@/lib/query-client';
import { Toaster } from 'sonner';
import { spaceGrotesk, inter } from '@/lib/fonts';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={spaceGrotesk.variable + ' ' + inter.variable + ' font-body'}>
        <QueryProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}