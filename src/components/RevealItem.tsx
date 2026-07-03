import { useInView } from "@/hooks/useInView";
import type { ReactNode, CSSProperties } from "react";

type AnimationClass =
    | "animate-fade-in"
    | "animate-fade-in-up"
    | "animate-fade-in-down"
    | "animate-slide-in-left"
    | "animate-slide-in-right"
    | "animate-scale-in";

interface RevealItemProps {
    children: ReactNode;
    /** Tailwind animation class to apply when in view. Default: "animate-fade-in-up" */
    animation?: AnimationClass;
    /** Optional delay in milliseconds, applied via inline style */
    delay?: number;
    /** Extra className to forward to the wrapper div (layout, spacing, etc.) */
    className?: string;
}

/**
 * RevealItem — wraps any content in a scroll-triggered reveal animation.
 *
 * - When IN view   : applies the chosen animation class (keyframe plays from opacity-0).
 * - When OUT of view: fades out smoothly via CSS transition (no jarring snap to opacity-0).
 * - Re-triggers cleanly every time the element re-enters the viewport.
 *
 * The smooth exit (transition) prevents the "flickering" that occurs when the
 * animation class is removed and opacity snaps instantly to 0.
 *
 * Powered by `useInView` (native IntersectionObserver, threshold 0.15, rootMargin -50px).
 */
export default function RevealItem({
    children,
    animation = "animate-fade-in-up",
    delay,
    className = "",
}: RevealItemProps) {
    const { ref, inView } = useInView();

    const style: CSSProperties = {
        // Stagger delay only applies during the enter animation
        ...(delay && inView ? { animationDelay: `${delay}ms` } : {}),
        // Smooth fade-out when leaving viewport — prevents jarring opacity snap
        ...(!inView ? { transition: "all 0.4s ease-out" } : {}),
    };

    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            className={`${inView ? animation : "opacity-0"} ${className}`.trim()}
            style={style}
        >
            {children}
        </div>
    );
}
