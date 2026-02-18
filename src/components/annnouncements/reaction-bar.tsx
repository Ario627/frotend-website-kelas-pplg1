'use client';

import { useState, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { EmojiPicker } from './emoji-picker';
import {
    ReactionType,
    REACTION_EMOJI_MAP,
    type ReactionCount,
} from '@/types/announcements.types';

// ─── Floating particle effect ────────────────────────────────────────
function FloatingEmoji({ emoji, onDone }: { emoji: string; onDone: () => void }) {
    return (
        <motion.span
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{
                opacity: 0,
                y: -40,
                scale: 1.6,
                x: Math.random() * 30 - 15,
            }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            onAnimationComplete={onDone}
            className="absolute -top-2 left-1/2 -translate-x-1/2 pointer-events-none text-sm z-50"
            aria-hidden
        >
            {emoji}
        </motion.span>
    );
}

// ─── Single reaction pill ────────────────────────────────────────────
interface ReactionPillProps {
    type: ReactionType;
    count: number;
    isActive: boolean;
    onClick: () => void;
    disabled?: boolean;
}

function ReactionPill({ type, count, isActive, onClick, disabled }: ReactionPillProps) {
    const [particles, setParticles] = useState<number[]>([]);
    const emoji = REACTION_EMOJI_MAP[type];

    const handleClick = () => {
        if (!isActive) {
            // Float-up particle saat user klik untuk add
            setParticles((prev) => [...prev, Date.now()]);
        }
        onClick();
    };

    const removeParticle = useCallback((id: number) => {
        setParticles((prev) => prev.filter((p) => p !== id));
    }, []);

    return (
        <motion.button
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={handleClick}
            disabled={disabled}
            className={`
        relative flex items-center gap-1 px-2 py-0.5 text-[11px]
        border transition-colors cursor-pointer disabled:opacity-50
        ${isActive
                    ? 'bg-[rgb(var(--lavender))] border-[rgb(var(--mint))] text-[rgb(var(--charcoal))]'
                    : 'bg-white border-[rgb(var(--border))] text-[rgb(var(--slate))] hover:bg-[rgb(var(--lavender))/0.5]'
                }
      `}
        >
            <span className="text-xs leading-none">{emoji}</span>
            <motion.span
                key={count}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="font-medium tabular-nums leading-none"
            >
                {count}
            </motion.span>

            {/* Float-up particles */}
            <AnimatePresence>
                {particles.map((id) => (
                    <FloatingEmoji key={id} emoji={emoji} onDone={() => removeParticle(id)} />
                ))}
            </AnimatePresence>
        </motion.button>
    );
}

// ─── Main ReactionBar ────────────────────────────────────────────────
interface ReactionBarProps {
    announcementId: string;
    reactions: ReactionCount[];
    userReaction?: ReactionType | null;
    onReact: (announcementId: string, type: ReactionType) => void;
    onRemoveReaction: (announcementId: string) => void;
    disabled?: boolean;
}

export function ReactionBar({
    announcementId,
    reactions,
    userReaction,
    onReact,
    onRemoveReaction,
    disabled,
}: ReactionBarProps) {
    const [showPicker, setShowPicker] = useState(false);
    const id = useId();

    const visibleReactions = (reactions || [])
        .filter((r) => r.count > 0)
        .sort((a, b) => b.count - a.count);

    const handlePillClick = (type: ReactionType) => {
        if (userReaction === type) {
            // Toggle off — remove reaction
            onRemoveReaction(announcementId);
        } else {
            // Add / switch reaction
            onReact(announcementId, type);
        }
    };

    const handlePickerSelect = (type: ReactionType) => {
        if (userReaction === type) {
            onRemoveReaction(announcementId);
        } else {
            onReact(announcementId, type);
        }
        setShowPicker(false);
    };

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {/* Grouped emoji pills */}
            <AnimatePresence mode="popLayout">
                {visibleReactions.map((r) => (
                    <ReactionPill
                        key={`${id}-${r.type}`}
                        type={r.type}
                        count={r.count}
                        isActive={userReaction === r.type}
                        onClick={() => handlePillClick(r.type)}
                        disabled={disabled}
                    />
                ))}
            </AnimatePresence>

            {/* Add reaction "+" button */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowPicker(!showPicker)}
                    className="w-6 h-6 flex items-center justify-center border border-dashed border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:text-[rgb(var(--charcoal))] hover:border-[rgb(var(--slate))] hover:bg-[rgb(var(--lavender))/0.4] transition-colors cursor-pointer"
                    aria-label="Tambah reaksi"
                >
                    <Plus size={12} />
                </motion.button>

                <AnimatePresence>
                    {showPicker && (
                        <EmojiPicker
                            onSelect={handlePickerSelect}
                            onClose={() => setShowPicker(false)}
                            disabled={disabled}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
