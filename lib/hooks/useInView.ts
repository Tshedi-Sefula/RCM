"use client";

import { useEffect, useRef, useState } from "react";

type Options = IntersectionObserverInit & {
  // Stop observing after the element first becomes visible.
  once?: boolean;
};

export function useInView<T extends Element>({ once = true, ...init }: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { root, rootMargin = "0px 0px -10% 0px", threshold = 0.15 } = init;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { root, rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, root, rootMargin, threshold]);

  return { ref, inView };
}
