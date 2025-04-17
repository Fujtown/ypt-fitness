'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  href?: string;
  fullWidth?: boolean;
}

export function AnimatedButton({
  children,
  className = '',
  variant = 'primary',
  href,
  fullWidth = false,
  ...props
}: ButtonProps) {
  // Determine button styles based on variant
  const getButtonStyles = () => {
    const baseStyles = 'inline-flex items-center justify-center py-3 px-6 font-light transition-all duration-300';
    const widthStyles = fullWidth ? 'w-full' : '';

    switch (variant) {
      case 'primary':
        return cn(
          baseStyles,
          widthStyles,
          'bg-primary text-black dark:text-white hover:bg-primary/90',
          className
        );
      case 'outline':
        return cn(
          baseStyles,
          widthStyles,
          'border border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary',
          className
        );
      case 'ghost':
        return cn(
          baseStyles,
          widthStyles,
          'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-900',
          className
        );
      default:
        return cn(baseStyles, widthStyles, className);
    }
  };

  // Define animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 }
  };

  // Use Link if href is provided, otherwise use button
  if (href) {
    return (
      <Link href={href} className={getButtonStyles()}>
        <motion.span
          className="inline-flex items-center justify-center"
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      className={getButtonStyles()}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
      {...props}
    >
      {children}
    </motion.button>
  );
}
