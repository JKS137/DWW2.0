import { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', damping: 25, stiffness: 150 } 
  },
  exit: { 
    opacity: 0, 
    y: -15, 
    transition: { duration: 0.2 } 
  },
};

export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const staggerContainerVariant: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Fix: Explicitly typed `buttonVariants` as `Variants` to fix type incompatibility with framer-motion.
export const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
  tap: {
    scale: 0.95,
  },
};

export const modalBackdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.2 } },
};

export const modalContentVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 250, damping: 25, delay: 0.1 }
    },
    exit: { 
        opacity: 0, 
        y: 30, 
        scale: 0.98,
        transition: { duration: 0.2 }
    }
};