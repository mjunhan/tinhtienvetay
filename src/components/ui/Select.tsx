import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends Omit<HTMLMotionProps<'select'>, 'ref'> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label className="text-sm font-medium text-text-main/80">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <motion.select
                        ref={ref}
                        whileFocus={{ scale: 1.01 }}
                        className={cn(
                            "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/50 text-text-main appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer",
                            error && "border-red-400 focus:ring-red-100",
                            className
                        )}
                        {...props}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </motion.select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
                {error && (
                    <span className="text-xs text-red-500 ml-1">{error}</span>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
