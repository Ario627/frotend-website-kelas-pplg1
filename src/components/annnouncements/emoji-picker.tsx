'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    ReactionType,
    REACTION_EMOJI_MAP,
    REACTION_TYPES,
} from '@/types/announcements.types';

const REACTION_LABELS: Record<ReactionType, string> = {
    [ReactionType.LIKE]: 'Suka',
    [ReactionType.LOVE]: 'Cinta',
    [ReactionType.HAHA]: 'Haha',
    [ReactionType.WOW]: 'Wow',
    [ReactionType.SAD]: 'Sedih',
    [ReactionType.ANGRY]: 'Marah',
};

interface EmojiPickerProps {
    onSelect: (type: ReactionType) => void;
    onClose: () => void;
    disabled?: boolean;
}

export function EmojiPicker({ onSelect, onClose, disabled }: EmojiPickerProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute bottom-full right-0 mb-2 bg-white border border-[rgb(var(--border))] shadow-[4px_4px_0_rgb(var(--shadow)/0.15)] p-1.5 flex gap-0.5 z-50"
        >
            {REACTION_TYPES.map((type, i) => (
                <motion.button
                    key={type}
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        delay: i * 0.04,
                        type: 'spring',
                        stiffness: 600,
                        damping: 20,
                    }}
                    whileHover={{ scale: 1.35, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSelect(type)}
                    disabled={disabled}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[rgb(var(--lavender))] transition-colors text-base disabled:opacity-50 cursor-pointer relative group"
                    title={REACTION_LABELS[type]}
                >
                    {REACTION_EMOJI_MAP[type]}

                    {/* Tooltip label */}
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[rgb(var(--charcoal))] text-white text-[9px] px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {REACTION_LABELS[type]}
                    </span>
                </motion.button>
            ))}
        </motion.div>
    );
}
