import type {Metadata} from 'next';
import '@fontsource/oswald/400.css';
import '@fontsource/oswald/600.css';
import '@fontsource/oswald/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { FamintoModeOverlay } from '@/components/layout/FamintoModeOverlay';

export const metadata: Metadata = {
  title: 'Burguer Faminto | Hambúrgueres que matam a fome',
  description: 'Hambúrgueres, combos e muito sabor. Faz o teu pedido no Burguer Faminto.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Burguer Faminto',
    description: 'A tua fome acabou de encontrar o lugar certo.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Burguer Faminto',
    description: 'A tua fome acabou de encontrar o lugar certo.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-AO" className="dark">
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col relative">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <FamintoModeOverlay />
      </body>
    </html>
  );
}
