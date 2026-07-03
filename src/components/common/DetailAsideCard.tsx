import { Link } from "react-router-dom";

export type DetailAsideItem = {
    id: number;
    title: string;
    meta: string;
    to: string;
};

interface DetailAsideCardProps {
    title: string;
    items: DetailAsideItem[];
    emptyText: string;
}

export default function DetailAsideCard({ title, items, emptyText }: DetailAsideCardProps) {
    return (
        <article className="p-4 border-l-4 border-l-amber-500 border border-[#1f1f1f] bg-[#111]">
            <h2 className="text-sm font-bold uppercase tracking-[2px] text-[#ffd700] mb-4">
                {title}
            </h2>

            {items.length > 0 ? (
                <div className="flex flex-col divide-y divide-[#1f1f1f]">
                    {items.map((item) => (
                        <Link
                            key={`${title}-${item.id}`}
                            to={item.to}
                            className="py-3 first:pt-0 last:pb-0 group"
                        >
                            <p className="text-xs uppercase tracking-[1px] text-[#777] mb-1">
                                {item.meta}
                            </p>
                            <h3 className="text-sm font-semibold leading-snug text-[#e5e2e1] group-hover:text-[#ffd700] transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-[#777] leading-relaxed">{emptyText}</p>
            )}
        </article>
    );
}
