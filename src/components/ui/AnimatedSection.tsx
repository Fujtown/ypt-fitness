'use client';

import type { ReactNode } from 'react';
import { motion, type MotionProps, type Variants } from 'framer-motion';

// Animation variants for fading in
const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Animation variants for staggered children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

// Animation variants for fading in from left
export const fadeInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Animation variants for fading in from right
export const fadeInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Animation variants for fading in with scale
export const fadeInScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

interface AnimatedSectionProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fadeIn' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale' | 'stagger';
  once?: boolean;
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  variant = 'fadeIn',
  once = true,
  ...rest
}: AnimatedSectionProps) {
  // Choose the variant based on the prop
  const getVariant = (): Variants => {
    switch (variant) {
      case 'fadeInLeft':
        return fadeInLeftVariants;
      case 'fadeInRight':
        return fadeInRightVariants;
      case 'fadeInScale':
        return fadeInScaleVariants;
      case 'stagger':
        return staggerContainer;
      default:
        return fadeInVariants;
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={getVariant()}
      transition={{
        delay,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// For individual staggered item animations
export function AnimatedItem({
  children,
  className = '',
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeInVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
