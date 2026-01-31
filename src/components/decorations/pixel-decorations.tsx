'use client';

export function PixelCornerDecoration({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const positionClasses = {
    'top-left': 'top-4 left-4 lg:top-8 lg:left-8',
    'top-right': 'top-4 right-4 lg:top-8 lg:right-8',
    'bottom-left': 'bottom-4 left-4 lg:bottom-8 lg:left-8',
    'bottom-right': 'bottom-4 right-4 lg:bottom-8 lg:right-8',
  };

  return (
    <div className={`absolute ${positionClasses[position]} opacity-30`}>
      {/* Pixel art pattern */}
      <div className="grid grid-cols-5 gap-0.5">
        {/* Row 1 */}
        <div className="w-2 h-2 bg-[rgb(var(--mint))]" />
        <div className="w-2 h-2 bg-[rgb(var(--mint))]/50" />
        <div className="w-2 h-2" />
        <div className="w-2 h-2 bg-[rgb(var(--peach))]/50" />
        <div className="w-2 h-2 bg-[rgb(var(--peach))]" />
        
        {/* Row 2 */}
        <div className="w-2 h-2 bg-[rgb(var(--mint))]/50" />
        <div className="w-2 h-2 bg-[rgb(var(--blush))]" />
        <div className="w-2 h-2 bg-[rgb(var(--blush))]/50" />
        <div className="w-2 h-2 bg-[rgb(var(--sky))]" />
        <div className="w-2 h-2 bg-[rgb(var(--peach))]/50" />
        
        {/* Row 3 */}
        <div className="w-2 h-2" />
        <div className="w-2 h-2 bg-[rgb(var(--blush))]/50" />
        <div className="w-2 h-2 bg-[rgb(var(--lavender))]" />
        <div className="w-2 h-2 bg-[rgb(var(--sky))]/50" />
        <div className="w-2 h-2" />
        
        {/* Row 4 */}
        <div className="w-2 h-2 bg-[rgb(var(--sky))]/50" />
        <div className="w-2 h-2 bg-[rgb(var(--mint))]" />
        <div className="w-2 h-2 bg-[rgb(var(--mint))]/50" />
        <div className="w-2 h-2 bg-[rgb(var(--blush))]" />
        <div className="w-2 h-2 bg-[rgb(var(--blush))]/50" />
        
        {/* Row 5 */}
        <div className="w-2 h-2 bg-[rgb(var(--sky))]" />
        <div className="w-2 h-2 bg-[rgb(var(--sky))]/50" />
        <div className="w-2 h-2" />
        <div className="w-2 h-2 bg-[rgb(var(--peach))]/50" />
        <div className="w-2 h-2 bg-[rgb(var(--peach))]" />
      </div>
    </div>
  );
}

export function PixelStars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Scattered pixel stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute pixel-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div 
            className="w-1 h-1 lg:w-2 lg:h-2"
            style={{
              backgroundColor: ['rgb(var(--mint))', 'rgb(var(--peach))', 'rgb(var(--blush))', 'rgb(var(--sky))'][i % 4],
              opacity: 0.2 + Math.random() * 0.2,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function PixelFrame() {
  return (
    <div className="absolute inset-4 lg:inset-8 border-2 border-dashed border-[rgb(var(--mint))]/10 pointer-events-none">
      {/* Corner accents */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[rgb(var(--mint))]/30" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[rgb(var(--peach))]/30" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[rgb(var(--blush))]/30" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[rgb(var(--sky))]/30" />
    </div>
  );
}