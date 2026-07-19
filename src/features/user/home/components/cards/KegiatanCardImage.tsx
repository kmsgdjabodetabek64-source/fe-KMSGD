interface KegiatanCardImageProps {
    img: string;
    title: string;
    category: string;
}

export function KegiatanCardImage({ img, title, category }: KegiatanCardImageProps) {
    const isSpecial = category === "SPESIAL";
    const categoryColor = isSpecial ? "text-[#ffd700]" : "text-[#22c55e]";

    return (
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
    );
}