import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CartButton from '@/components/cart/CartButton';
import { getCurrentUser } from '@/lib/auth';
import { getContent } from '@/lib/content';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [user, content] = await Promise.all([getCurrentUser(), getContent()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-widest focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar user={user ? { name: user.name, email: user.email, role: user.role } : null} />
      <main id="main">{children}</main>
      <Footer content={content} />
      <CartDrawer />
      <CartButton />
    </>
  );
}
