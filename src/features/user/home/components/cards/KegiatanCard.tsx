import { Link } from "react-router-dom";

interface Props {
    id: number;
    img: string;
    title: string;
    desc: string;
    date: string;
    category: string;
    location: string;
}

export default function KegiatanCard({ id, img, title, desc, date, category, location }: Props) {
    const isSpecial = category === "SPESIAL";
    const categoryColor = isSpecial ? "text-[#ffd700]" : "text-[#22c55e]";

    return (
        <article className="bg-[#20201f] border-t-2 border-[#ffd700] group hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40 transition-all duration-300 flex flex-col">
            <div className="h-32 md:h-48 overflow-hidden relative">
                <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#131313] via-transparent to-transparent" />
                <span className={`absolute top-2 left-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[2px] px-2 py-0.5 rounded-sm bg-black/60 backdrop-blur-sm ${categoryColor}`}>
                    {category}
                </span>
            </div>
            <div className="p-3 md:p-5 flex flex-col flex-1">
                <time className="text-[10px] md:text-xs text-[#777] uppercase tracking-widest mb-1.5">
                    {date}
                </time>
                <h3 className="text-sm md:text-lg font-bold font-['Montserrat'] text-[#e5e2e1] mb-1.5 md:mb-2 line-clamp-2 group-hover:text-[#ffd700] transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-[#888] text-xs md:text-sm leading-relaxed line-clamp-2 overflow-hidden mb-3 md:mb-4">
                    {desc}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#353535] group-hover:border-[#4d4732] transition-colors duration-300">
                    <div className="flex items-center gap-1.5 text-[#666] min-w-0">
                        <svg className="w-3 h-3 shrink-0 text-[#ffd700]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="text-[10px] md:text-xs uppercase tracking-wide font-medium truncate">
                            {location}
                        </span>
                    </div>
                    <Link
                        to={`/kegiatan/detail/${id}`}
                        className="group/link text-[#ffd700] text-xs md:text-sm font-semibold hover:underline shrink-0 ml-2 inline-flex items-center gap-1"
                    >
                        Detail
                        <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}