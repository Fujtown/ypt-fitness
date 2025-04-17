'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useAnimationFrame, MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollingTextProps {
  text: string;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
  repeat?: number;
  separator?: string;
}

export function ScrollingText({
  text,
  className = '',
  speed = 30,
  direction = 'left',
  repeat = 3,
  separator = '•'
}: ScrollingTextProps) {
  const baseText = separator ? `${text} ${separator} ` : text;
  const repeatedText = baseText.repeat(repeat);

  return (
    <div className={cn('w-full overflow-hidden whitespace-nowrap', className)}>
      <AutoScrollText
        text={repeatedText}
        speed={speed}
        direction={direction}
      />
    </div>
  );
}

interface AutoScrollTextProps {
  text: string;
  speed: number;
  direction: 'left' | 'right';
}

function AutoScrollText({ text, speed, direction }: AutoScrollTextProps) {
  const [textWidth, setTextWidth] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const xPos = useRef(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate text and container width on mount and resize
  useEffect(() => {
    const updateWidths = () => {
      if (textRef.current && containerRef.current) {
        setTextWidth(textRef.current.offsetWidth);
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial measurement
    updateWidths();

    // Add resize listener
    window.addEventListener('resize', updateWidths);

    // Cleanup
    return () => window.removeEventListener('resize', updateWidths);
  }, []); // Empty dependency array for mount/unmount only

  // Animate the text
  useAnimationFrame(() => {
    if (!textRef.current || textWidth === 0) return;

    // Calculate the position shift based on direction and speed
    const shift = direction === 'left' ? -speed / 60 : speed / 60;

    // Update position
    xPos.current += shift;

    // Reset position when text moves out of view
    if (direction === 'left' && xPos.current < -textWidth) {
      xPos.current = containerWidth;
    } else if (direction === 'right' && xPos.current > containerWidth) {
      xPos.current = -textWidth;
    }

    // Apply the transformation
    if (textRef.current) {
      textRef.current.style.transform = `translateX(${xPos.current}px)`;
    }
  });

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div
        ref={textRef}
        className="inline-block"
        style={{ transform: `translateX(${direction === 'left' ? 0 : -textWidth}px)` }}
      >
        <span className="text-xl font-light tracking-wide">{text}</span>
      </div>
    </div>
  );
}

export function ParallaxText({
  text,
  className = '',
  baseVelocity = 3,
}: {
  text: string;
  className?: string;
  baseVelocity?: number;
}) {
  // Create a motion value for x
  const xValue = useRef(new MotionValue(0));
  const { scrollY } = useScroll();

  // Convert ref to motion value
  const scrollVelocityValue = useRef(new MotionValue(0));
  const scrollVelocity = scrollVelocityValue.current;

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  // Create a valid motion value for the x transform
  const x = useTransform(xValue.current, (v: number) => `${wrap(-50, -45, v)}%`);

  const directionFactor = useRef<number>(1);

  // Track scroll velocity
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      scrollVelocity.set(latest);
    });
    return unsubscribe;
  }, [scrollY, scrollVelocity]);

  // Animate text based on velocity
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    // Update the motion value
    xValue.current.set(xValue.current.get() + moveBy);
  });

  return (
    <div className={cn("overflow-hidden whitespace-nowrap flex flex-nowrap", className)}>
      <motion.div
        className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight flex whitespace-nowrap flex-nowrap"
        style={{ x }}
      >
        <span className="block mr-6">{text}</span>
        <span className="block mr-6">{text}</span>
        <span className="block mr-6">{text}</span>
        <span className="block mr-6">{text}</span>
      </motion.div>
    </div>
  );
}

// Wrap function needed for ParallaxText
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

// Simpler version without scroll-linked animation
export function SimpleMarquee({
  text,
  className = '',
  speed = 25
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap py-4", className)}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 1000 / speed,
            ease: "linear",
          },
        }}
      >
        {/* Using a more specific key with text content to avoid array index key warnings */}
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={`marquee-${text.slice(0, 5)}-${i}`}
            className="inline-block mr-8 text-2xl font-light"
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
