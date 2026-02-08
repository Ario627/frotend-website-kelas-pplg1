'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/input';
import { 
  Menu, 
  X, 
  Gamepad2,
  Megaphone,
  Image,
  Users,
  Rocket,
  FolderOpen,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Gamepad2 },
  { href: '/announcements', label: 'Pengumuman', icon: Megaphone },
  { href: '/gallery', label: 'Galeri', icon: Image },
  { href: '/members', label: 'Anggota', icon: Users },
  { href: '/projects', label: 'Proyek', icon: Rocket },
  { href: '/storage', label: 'Kumpulan', icon: FolderOpen },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-[--duration-normal]',
        isScrolled 
          ? 'bg-[--color-base]/95 backdrop-blur-md border-b-2 border-[--color-border-subtle] shadow-lg' 
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="size-10 bg-[--color-accent] flex items-center justify-center shadow-[--shadow-pixel]"
              whileHover={{ scale: 1.05, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gamepad2 className="size-5 text-[--color-base]" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-pixel text-sm text-[--color-foreground]">X PPLG 1</span>
              <span className="block text-[10px] text-[--color-foreground-muted]">SMKN 1 Purwokerto</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'relative px-4 py-2 font-pixel text-xs',
                      'transition-colors duration-[--duration-fast]',
                      isActive 
                        ? 'text-[--color-accent]' 
                        : 'text-[--color-foreground-secondary] hover:text-[--color-foreground]'
                    )}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="size-4" />
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[--color-accent]"
                        layoutId="navbar-indicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="size-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="size-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-[--color-border-subtle]"
            >
              <div className="py-4 space-y-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3',
                          'font-pixel text-xs',
                          'transition-colors duration-[--duration-fast]',
                          isActive
                            ? 'bg-[--color-accent]/10 text-[--color-accent] border-l-2 border-[--color-accent]'
                            : 'text-[--color-foreground-secondary] hover:bg-[--color-elevated] hover:text-[--color-foreground]'
                        )}
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}