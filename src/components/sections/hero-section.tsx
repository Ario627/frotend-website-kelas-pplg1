'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { PixelButton } from '@/components/pixel/pixel-button';
import { Megaphone, Image, Users, Sparkles } from 'lucide-react';
import { useStats } from '@/hooks/use-stats';

// Pixel decorations data
const pixelDecorations = [
  { size: 'w-3 h-3', color: 'bg-[rgb(var(--mint))]', position: 'top-[15%] left-[10%]', delay: 0 },
  { size: 'w-2 h-2', color: 'bg-[rgb(var(--peach))]', position: 'top-[20%] right-[15%]', delay: 0.3 },
  { size: 'w-4 h-4', color: 'bg-[rgb(var(--blush))]', position: 'top-[35%] left-[8%]', delay: 0.6 },
  { size: 'w-2 h-2', color: 'bg-[rgb(var(--sky))]', position: 'top-[25%] right-[8%]', delay: 0.9 },
  { size: 'w-3 h-3', color: 'bg-[rgb(var(--lavender))]', position: 'bottom-[30%] left-[12%]', delay: 1.2 },
  { size: 'w-2 h-2', color: 'bg-[rgb(var(--mint))]', position: 'bottom-[25%] right-[10%]', delay: 1.5 },
  { size: 'w-4 h-4', color: 'bg-[rgb(var(--peach))]', position: 'bottom-[40%] right-[18%]', delay: 1.8 },
  { size: 'w-2 h-2', color: 'bg-[rgb(var(--sky))]', position: 'top-[45%] left-[18%]', delay: 2.1 },
  { size: 'w-3 h-3', color: 'bg-[rgb(var(--blush))]', position: 'bottom-[20%] left-[22%]', delay: 2.4 },
  { size: 'w-2 h-2', color: 'bg-[rgb(var(--lavender))]', position: 'top-[55%] right-[22%]', delay: 2.7 },
];

// Letters for scatter animation
const letters = [' ', 'P', 'P', 'L', 'G', ' ', '1'];

// Random scatter positions for each letter
const getRandomScatter = () => ({
  x: (Math.random() - 0.5) * 200,
  y: (Math.random() - 0.5) * 150,
  rotate: (Math.random() - 0.5) * 180,
  scale: Math.random() * 0.5 + 0.5,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const }
  },
};

export function HeroSection() {
  const { data: stats, isLoading } = useStats();
  const [isScattered, setIsScattered] = useState(false);
  const [scatterPositions, setScatterPositions] = useState<{ x: number; y: number; rotate: number; scale: number }[]>([]);

  // Generate scatter positions once
  useEffect(() => {
    setScatterPositions(letters.map(() => getRandomScatter()));
  }, []);

  // Scatter animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setIsScattered(true);
      setScatterPositions(letters.map(() => getRandomScatter()));

      setTimeout(() => {
        setIsScattered(false);
      }, 1500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-[57vh] items-center justify-center px-4 pt-16 pb-10 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgb(var(--charcoal)) 1px, transparent 1px),
              linear-gradient(90deg, rgb(var(--charcoal)) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-rgb(var(--cream))" />
      </div>

      {/* Pixel Decorations */}
      {pixelDecorations.map((decoration, index) => (
        <motion.div
          key={index}
          className={`absolute ${decoration.size} ${decoration.color} ${decoration.position} opacity-50`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
            scale: { duration: 0.5, delay: decoration.delay },
            y: { duration: 2 + index * 0.2, repeat: Infinity, ease: 'easeInOut' as const, delay: decoration.delay },
          }}
        />
      ))}

      {/* Additional geometric pixel shapes */}
      <motion.div
        className="absolute top-[30%] left-[5%] w-6 h-1 bg-[rgb(var(--mint))] opacity-30"
        animate={{ scaleX: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute top-[60%] right-[5%] w-1 h-6 bg-[rgb(var(--peach))] opacity-30"
        animate={{ scaleY: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute bottom-[35%] left-[3%] w-4 h-4 border-2 border-[rgb(var(--sky))] opacity-30"
        animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute top-[40%] right-[3%] w-4 h-4 border-2 border-[rgb(var(--blush))] opacity-30"
        animate={{ rotate: [0, -90, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' as const }}
      />

      {/* Cross shapes */}
      <motion.div
        className="absolute top-[18%] left-[25%] opacity-20"
        animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
      >
        <div className="w-4 h-1 bg-[rgb(var(--mint))] absolute top-1/2 left-0 -translate-y-1/2" />
        <div className="w-1 h-4 bg-[rgb(var(--mint))] absolute top-0 left-1/2 -translate-x-1/2" />
      </motion.div>
      <motion.div
        className="absolute bottom-[22%] right-[25%] opacity-20"
        animate={{ rotate: [0, -180, -360], scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
      >
        <div className="w-4 h-1 bg-[rgb(var(--peach))] absolute top-1/2 left-0 -translate-y-1/2" />
        <div className="w-1 h-4 bg-[rgb(var(--peach))] absolute top-0 left-1/2 -translate-x-1/2" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Small Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--lavender))] text-xs text-[rgb(var(--slate))]">
            Tahap Development ya guyss
          </span>
        </motion.div>

        {/* Main Heading with Scatter Animation */}
        <motion.h1
          variants={itemVariants}
          className="font-pixel text-2xl sm:text-3xl md:text-4xl text-[rgb(var(--charcoal))] mb-4 leading-relaxed relative"
        >
          <span className="relative inline-flex justify-center">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className={`inline-block ${letter === ' ' ? 'w-3' : ''}`}
                animate={
                  isScattered && scatterPositions[index]
                    ? {
                      x: scatterPositions[index].x,
                      y: scatterPositions[index].y,
                      rotate: scatterPositions[index].rotate,
                      scale: scatterPositions[index].scale,
                      opacity: 0.6,
                    }
                    : {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                    }
                }
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: isScattered ? index * 0.05 : (letters.length - index) * 0.03,
                }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              className="absolute -right-6 -top-2 text-[rgb(var(--mint))] text-lg"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
            >
              ✦
            </motion.span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-[rgb(var(--slate))] max-w-lg mx-auto mb-10 text-base sm:text-lg leading-relaxed"
        >
          Gassss terussss
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/announcements">
            <PixelButton variant="mint" size="lg" className='cursor-pointer'>
              <Megaphone size={16} />
              Lihat Pengumuman
            </PixelButton>
          </Link>
        </motion.div>

        {/* Quick Stats - Subtle */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-12"
        >
          {[
            { icon: Megaphone, label: 'Pengumuman', value: stats?.announcements ?? 0 },
            { icon: Image, label: 'Foto', value: stats?.gallery ?? 0 },
            { icon: Users, label: 'Anggota', value: 36 },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <stat.icon size={14} className="text-[rgb(var(--slate))]" />
                <span className={`font-pixel text-lg text-[rgb(var(--charcoal))] ${isLoading ? 'animate-pulse-subtle' : ''}`}>
                  {isLoading ? '-' : stat.value}
                </span>
              </div>
              <span className="text-xs text-[rgb(var(--muted))]">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[rgb(var(--border))] to-transparent" />
    </section>
  );
}