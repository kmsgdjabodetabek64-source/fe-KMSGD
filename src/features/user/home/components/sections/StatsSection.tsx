import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { homeStats } from "../../services/homeService";
import { getHomeStatsFromBackend } from "../../services/homeStatsService";
import RevealItem from "@/components/RevealItem";

const AnimatedNumber = ({ endValue }: { endValue: string | number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const target = parseInt(endValue.toString().replace(/\D/g, "")) || 0;

        if (target === 0) {
            return;
        }

        let startTimestamp: number;
        const duration = 2000;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(easeOutProgress * target));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [endValue]);

    const suffix = endValue.toString().replace(/[0-9]/g, "");

    return <>{count}{suffix}</>;
};

export default function StatsSection() {
    const statsQuery = useQuery({
        queryKey: ["home-stats"],
        queryFn: getHomeStatsFromBackend,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const stats = statsQuery.data ?? homeStats;

    return (
        <RevealItem animation="animate-fade-in-up">
            <section className="bg-[#0e0e0e] py-12 border-y border-[#353535] font-['Montserrat']">
                <dl className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#353535] text-center m-0">
                    {stats.map(({ value, label }, i) => (
                        <RevealItem key={label} animation="animate-scale-in" delay={i * 60}>
                            <div className="py-6 md:py-0">
                                <dd className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Montserrat'] text-[#ffd700] mb-2 m-0">
                                    <AnimatedNumber endValue={value} />
                                </dd>
                                <dt className="text-[11px] sm:text-xs font-semibold tracking-wide sm:tracking-widest text-[#d0c6ab] uppercase m-0">{label}</dt>
                            </div>
                        </RevealItem>
                    ))}
                </dl>
            </section>
        </RevealItem>
    );
}