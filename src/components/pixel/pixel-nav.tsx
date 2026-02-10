'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { Menu, X } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 bg-[rgb(var(--cream))]/95 backdrop-blur-sm border-b border-[rgb(var(--border))]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-pixel text-sm text-[rgb(var(--charcoal))] flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            PPLG
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-1.5 text-xs transition-colors relative',
                    isActive
                      ? 'text-[rgb(var(--charcoal))]'
                      : 'text-[rgb(var(--slate))] hover:text-[rgb(var(--charcoal))]'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(var(--mint))]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[rgb(var(--charcoal))]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-3 border-t border-[rgb(var(--border))]">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-3 py-2.5 text-sm transition-colors',
                        isActive
                          ? 'text-[rgb(var(--charcoal))] bg-[rgb(var(--mint))/0.2]'
                          : 'text-[rgb(var(--slate))]'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}