'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedImageProps extends Omit<ImageProps, 'onLoad'> {
  containerClassName?: string;
  imageEffect?: 'zoomIn' | 'zoomOut' | 'fadeIn' | 'slideUp' | 'none';
  hoverEffect?: 'zoomIn' | 'zoomOut' | 'none';
}

export function AnimatedImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  priority,
  quality,
  className = '',
  containerClassName = '',
  imageEffect = 'fadeIn',
  hoverEffect = 'none',
  ...rest
}: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Image load effect variants
  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: imageEffect === 'zoomIn' ? 1.1 :
             imageEffect === 'zoomOut' ? 0.9 : 1,
      y: imageEffect === 'slideUp' ? 20 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Hover effect variants
  const hoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: hoverEffect === 'zoomIn' ? 1.05 :
             hoverEffect === 'zoomOut' ? 0.95 : 1,
      transition: { duration: 0.3 }
    },
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden',
        containerClassName
      )}
      initial="initial"
      whileHover={hoverEffect !== 'none' ? 'hover' : undefined}
      variants={hoverVariants}
    >
      <motion.div
        initial={imageEffect !== 'none' ? 'hidden' : 'visible'}
        animate={isLoaded ? 'visible' : 'hidden'}
        variants={imageVariants}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          sizes={sizes}
          quality={quality || 90}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'object-cover',
            className
          )}
          {...rest}
        />
      </motion.div>
    </motion.div>
  );
}
