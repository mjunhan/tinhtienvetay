import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have clsx/tailwind-merge setup, I'll update utils.ts if needed or inline it.

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    delay?: number;
    id?: string;
    style?: React.CSSProperties;
}

export function Card({ children, className, title, delay = 0, id, style }: CardProps) {
    return (
        <motion.div
            id={id}
            style={style}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={cn(
                "bg-surface rounded-2xl shadow-sm border border-slate-100 p-6",
                className
            )}
        >
            {title && (
                <h3 className="text-xl font-bold text-text-main mb-4">{title}</h3>
            )}
            {children}
        </motion.div>
    );
}
