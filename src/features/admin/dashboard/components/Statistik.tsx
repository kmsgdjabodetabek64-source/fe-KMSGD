import { Link } from "react-router-dom";
import type { IconType } from "react-icons";
import { formatNumber } from "@/utils/formatters";

export type StatItem = {
    label: string;
    value: number;
    note: string;
    icon: IconType;
    path: string;
};

interface StatistikProps {
    stats: StatItem[];
    isLoading: boolean;
}

export default function Statistik({ stats, isLoading }: StatistikProps) {
    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {stats.map((item) => (
                <Link
                    key={item.label}
                    to={item.path}
                    className="flex flex-col justify-between border border-neutral-800 bg-neutral-900 p-3 sm:p-5 hover:border-[#FACC15] transition-colors"
                >
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                        <div className="min-w-0">
                            <p className="text-neutral-500 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest line-clamp-1">
                                {item.label}
                            </p>
                            <p className="mt-1 sm:mt-3 text-lg sm:text-3xl font-bold text-white tabular-nums leading-none truncate">
                                {isLoading ? "..." : formatNumber(item.value)}
                            </p>
                        </div>
                        <div className="inline-flex shrink-0 h-7 w-7 sm:h-10 sm:w-10 items-center justify-center bg-neutral-800 text-[#FACC15]">
                            <item.icon className="text-base sm:text-2xl" />
                        </div>
                    </div>
                    <p className="mt-3 sm:mt-4 text-[9px] sm:text-xs text-neutral-500 leading-tight line-clamp-2">
                        {isLoading ? "Memuat..." : item.note}
                    </p>
                </Link>
            ))}
        </div>
    );
}