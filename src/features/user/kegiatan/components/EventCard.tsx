import type { Kegiatan } from "../types/kegiatan.types";
import ActionButton from "./ActionButton";

interface Props {
    event: Kegiatan;
}

export default function EventCard({ event }: Props) {
    const isSpecial = event.category === "SPESIAL";
    const categoryColor = isSpecial ? "text-[#ffd700]" : "text-[#22c55e]";

    return (
        <section className="flex flex-col md:flex-row bg-[#111] border border-[#1f1f1f] overflow-hidden md:min-h-48 hover:border-[#ffd700]/40 transition-all duration-300 group">

            {/* Image */}
            <div className="w-full md:w-56 flex shrink-0 overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-36 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 md:gap-3 p-3 md:p-8 flex-1">
                <div className="flex items-center gap-2 md:gap-4">
                    <span className="text-[9px] md:text-[10px] text-[#777] uppercase tracking-[2px] font-semibold">
                        {event.date}
                    </span>
                    <span className="text-[#2a2a2a]">|</span>
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[2px] ${categoryColor}`}>
                        {event.category}
                    </span>
                </div>

                <h3 className="text-sm md:text-xl font-bold text-white font-['Montserrat'] group-hover:text-[#ffd700] transition-colors duration-300 line-clamp-2">
                    {event.title}
                </h3>

                <p className="text-[#888] text-xs md:text-sm leading-relaxed line-clamp-2 overflow-hidden mb-3 md:mb-4">
                    {event.desc}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4 mt-2 md:mt-4 pt-2 md:pt-4 border-t border-[#1f1f1f]">
                    {/* Lokasi + Jam */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-2 text-[#666]">
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-[#ffd700]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="text-[10px] md:text-xs uppercase tracking-[1px] font-medium truncate max-w-25 md:max-w-none">
                                {event.location}
                            </span>
                        </div>

                        <span className="hidden sm:block text-[#2a2a2a]">|</span>

                        {/* Jam */}
                        <div className="flex items-center gap-2 text-[#666]">
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-[#ffd700]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="text-[10px] md:text-xs uppercase tracking-[1px] font-medium">
                                {event.startTime} – {event.endTime} WIB
                            </span>
                        </div>
                    </div>

                    <ActionButton label={event.action} to={`/kegiatan/detail/${event.id}`} />
                </div>
            </div>
        </section>
    );
}
