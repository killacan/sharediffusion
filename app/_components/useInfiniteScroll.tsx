import React, { useLayoutEffect } from 'react';

interface InfiniteScrollProps {
  trackElement: string;
  containerElement?: string;
  multiplier?: number;
}

export default function useInfiniteScroll(
  { trackElement, containerElement, multiplier = 1 }: InfiniteScrollProps,
  callback: () => void
) {
  useLayoutEffect(() => {
    // Element whose position we want to track
    const ele = document.querySelector(trackElement) as HTMLElement | null;

    // If not containerElement provided, we use window
    let container: Window | HTMLElement = window;
    if (containerElement) {
      container = document.querySelector(containerElement) as HTMLElement;
    }

    // Get window innerHeight or height of container (if provided)
    let h: number;
    if (containerElement) {
      h = (container as HTMLElement).getBoundingClientRect().height;
    } else {
      h = window.innerHeight;
    }

    const handleScroll = () => {
      if (!ele) return; // Check if element exists
      const elePos = ele.getBoundingClientRect().y;
      if (elePos * multiplier <= h) {
        if (typeof callback === 'function') callback();
      }
    };

    // Set a passive scroll listener on our container
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Handle cleanup by removing scroll listener
    return () => container.removeEventListener('scroll', handleScroll, { passive: true } as EventListenerOptions);
  }, [trackElement, containerElement, multiplier, callback]);
}