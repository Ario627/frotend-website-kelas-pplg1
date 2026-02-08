'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/announcements', label: 'Pengumuman' },
  { href: '/gallery', label: 'Galeri' },
  { href: '/members', label: 'Anggota' },
  { href: '/projects', label: 'Proyek' },
  { href: '/storage', label: 'Arsip' },
];

export function PixelNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[rgb(var(--cream))] pixel-border border-t-0 border-x-0">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-pixel text-lg text-[rgb(var(--charcoal))] pixel-hover p-2">
            <span className='color-pink'>PPLG</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-pixel text-xs px-4 py-2 transition-colors',
                  pathname === item.href
                    ? 'bg-[rgb(var(--mint))] text-[rgb(var(--charcoal))]'
                    : 'text-[rgb(var(--slate))] hover:bg-[rgb(var(--lavender))]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 pixel-hover"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t-2 border-[rgb(var(--border))]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block font-pixel text-xs px-4 py-3 transition-colors',
                  pathname === item.href
                    ? 'bg-[rgb(var(--mint))] text-[rgb(var(--charcoal))]'
                    : 'text-[rgb(var(--slate))] hover:bg-[rgb(var(--lavender))]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}