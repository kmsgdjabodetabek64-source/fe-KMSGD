interface KegiatanCardDescProps {
    desc: string;
}

export function KegiatanCardDesc({ desc }: KegiatanCardDescProps) {
    return (
        <p className="text-[#888] text-xs md:text-sm leading-relaxed line-clamp-2 overflow-hidden mb-3 md:mb-4">
            {desc}
        </p>
    );
}