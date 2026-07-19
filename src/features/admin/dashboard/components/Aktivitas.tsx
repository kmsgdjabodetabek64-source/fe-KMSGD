import { MdArticle } from "react-icons/md";
import { formatDate } from "@/utils/formatters";

export type RecentItem = {
    id: number;
    module: string;
    title: string;
    createdAt: string;
};

interface AktivitasProps {
    isLoading: boolean;
    items: RecentItem[];
}

export default function Aktivitas({ isLoading, items }: AktivitasProps) {
    return (
        <section className="border border-neutral-800 bg-neutral-900 p-3 sm:p-5">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                <MdArticle className="shrink-0 text-[#FACC15] text-xl sm:text-2xl" />
                <h2 className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                    Aktivitas
                </h2>
            </div>

            <div className="flex flex-col divide-y divide-neutral-800">
                {isLoading ? (
                    <p className="py-6 sm:py-8 text-xs sm:text-sm text-neutral-500 text-center">
                        Memuat aktivitas...
                    </p>
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <div key={`${item.module}-${item.id}`} className="py-2 sm:py-3">
                            <div className="flex items-center justify-between gap-2 sm:gap-3">
                                <p className="min-w-0 text-white text-xs sm:text-sm font-medium line-clamp-1">
                                    {item.title}
                                </p>
                                <span className="shrink-0 border border-neutral-700 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[10px] uppercase tracking-widest text-neutral-400">
                                    {item.module}
                                </span>
                            </div>
                            <p className="text-neutral-500 text-[10px] sm:text-xs mt-1">
                                {formatDate(item.createdAt)}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="py-6 sm:py-8 text-xs sm:text-sm text-neutral-500 text-center">
                        Belum ada aktivitas konten.
                    </p>
                )}
            </div>
        </section>
    );
}