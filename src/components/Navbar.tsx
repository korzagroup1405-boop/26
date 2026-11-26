'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, UserRound, ShoppingBag } from 'lucide-react';
import Logo from './Logo';
import { useCart } from './cart/CartProvider';
import { cx } from '@/lib/format';

const LEFT_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/reservations', label: 'Book a Table' },
];

const RIGHT_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/amenities', label: 'Amenities' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

type NavbarProps = {
  user: { name: string; email: string; role: string } | null;
};

export default function Navbar({ user }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { count, setOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setMobileOpen(false);
    router.refresh();
    router.push('/');
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-[60] transition-all duration-500',
          scrolled || mobileOpen
            ? 'border-b border-gold/15 bg-ink/92 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl'
            : 'border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent',
        )}
      >
        <div className="container-x">
          <div className="grid h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-4 lg:h-[88px]">
            {/* Left */}
            <nav aria-label="Primary" className="hidden items-center gap-6 xl:flex">
              {LEFT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cx('nav-link', isActive(link.href) && 'text-gold')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream transition hover:border-gold/60 hover:text-gold xl:hidden"
            >
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>

            {/* Center logo */}
            <div className="justify-self-center">
              <Logo size="sm" variant="inline" />
            </div>

            {/* Right */}
            <div className="hidden items-center justify-end gap-6 xl:flex">
              <nav aria-label="Secondary" className="flex items-center gap-6">
                {RIGHT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={cx('nav-link', isActive(link.href) && 'text-gold')}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={user.role === 'ADMIN' ? '/admin' : '/account'}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-gold/40 px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-cream transition hover:border-gold hover:text-gold"
                  >
                    {user.role === 'ADMIN' ? <LayoutDashboard size={14} /> : <UserRound size={14} />}
                    {user.role === 'ADMIN' ? 'Dashboard' : 'My Account'}
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    aria-label="Sign out"
                    className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-cream/12 text-beige transition hover:border-gold/50 hover:text-gold"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-gold/50 bg-gold/10 px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold transition hover:bg-gold hover:text-ink"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>

            {/* Mobile actions */}
            <div className="flex items-center justify-end gap-2 xl:hidden">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Open your order — ${count} items`}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cream/15 text-cream transition hover:border-gold/60 hover:text-gold"
              >
                <ShoppingBag size={17} />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-semibold text-ink">
                    {count}
                  </span>
                )}
              </button>
              {!user && (
                <Link
                  href="/login"
                  className="flex h-11 items-center rounded-full border border-gold/50 px-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cx(
          'fixed inset-0 z-[55] xl:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cx(
            'absolute inset-0 bg-ink/80 backdrop-blur-sm transition-opacity duration-500',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cx(
            'absolute inset-x-0 top-[76px] max-h-[calc(100svh-76px)] overflow-y-auto border-b border-gold/15 bg-wine/98 px-6 pb-10 pt-8 transition-all duration-500',
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
          )}
        >
          <nav aria-label="Mobile" className="flex flex-col divide-y divide-cream/8">
            {[...LEFT_LINKS, ...RIGHT_LINKS].map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between py-4"
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-[10px] tabular-nums text-gold/60">
                    0{index + 1}
                  </span>
                  <span className="font-display text-2xl text-cream transition group-hover:text-gold">
                    {link.label}
                  </span>
                </span>
                <span className="text-gold/40 transition group-hover:translate-x-1 group-hover:text-gold">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-7 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/account'}
                  className="btn-outline w-full"
                >
                  {user.role === 'ADMIN' ? 'Owner dashboard' : 'My account'}
                </Link>
                <button type="button" onClick={logout} className="btn-ghost w-full">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-gold w-full">
                  Login
                </Link>
                <Link href="/signup" className="btn-outline w-full">
                  Create an account
                </Link>
              </>
            )}
            <Link href="/reservations" className="btn-ghost w-full">
              Book a table
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
