import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "bg-primary/10 text-primary-dark hover:bg-primary/20 border-transparent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
        outline: "text-foreground border-slate-200 hover:bg-slate-100",
        destructive: "bg-red-50 text-red-700 hover:bg-red-100 border-transparent",
        success: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-transparent",
        warning: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent", // Gold/Warning flavor
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
