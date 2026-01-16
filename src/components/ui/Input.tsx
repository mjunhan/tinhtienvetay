import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, suffix, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-medium text-text-main/80">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <motion.input
                        ref={ref}
                        whileFocus={{ scale: 1.01 }} // Subtle scale up
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={cn(
                            "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                            error && "border-red-400 focus:ring-red-100 focus:border-red-400",
                            suffix && "pr-10",
                            className
                        )}
                        {...props}
                    />
                    {suffix && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">
                            {suffix}
                        </span>
                    )}
                </div>
                {error && (
                    <span className="text-xs text-red-500 ml-1">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
