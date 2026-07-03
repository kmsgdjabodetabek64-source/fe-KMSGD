import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
}

/**
 * useInView — lightweight IntersectionObserver hook.
 * Toggles `inView` true/false every time the element enters/exits the viewport,
 * so CSS animations re-play on each scroll into view.
 */
export function useInView({
    threshold = 0.15,
    rootMargin = "-50px",
}: UseInViewOptions = {}) {
    const ref = useRef<HTMLElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return { ref, inView };
}
