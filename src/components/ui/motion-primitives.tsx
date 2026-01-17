/**
 * Reusable Framer Motion variants and animation primitives
 * v0.3.0 - Golden Era
 */

import { Variants } from "framer-motion";

/**
 * Fade in from bottom with slide up
 */
export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

/**
 * Fade in from top with slide down
 */
export const fadeInDown: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
};

/**
 * Smooth fade in/out
 */
export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

/**
 * Stagger container for lists and grids
 */
export const staggerContainer: Variants = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

/**
 * Stagger item (use with staggerContainer)
 */
export const staggerItem: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

/**
 * Scale on hover and tap (for buttons)
 */
export const scaleOnHover = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 },
};

/**
 * Lift card on hover with golden glow
 */
export const liftWithGlow = {
    whileHover: {
        y: -5,
        boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.4)",
        transition: { duration: 0.3 },
    },
};

/**
 * Gentle scale on hover (for cards)
 */
export const gentleScale = {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.3 },
};

/**
 * Spring animation config
 */
export const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
};

/**
 * Smooth easing config
 */
export const smoothEasing = {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as const,
};
