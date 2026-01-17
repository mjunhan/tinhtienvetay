"use client";

import { motion } from "framer-motion";

/**
 * Page transition template using Framer Motion
 * Applies fade-in + slide-up animation to all page transitions
 */
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1], // Custom easing for smooth animation
            }}
        >
            {children}
        </motion.div>
    );
}
