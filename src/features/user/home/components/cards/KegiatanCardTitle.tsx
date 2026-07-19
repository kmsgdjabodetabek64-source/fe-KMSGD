interface KegiatanCardTitleProps {
    title: string;
}

export function KegiatanCardTitle({ title }: KegiatanCardTitleProps) {
    return (
        <h3 className="text-sm md:text-lg font-bold font-['Montserrat'] text-[#e5e2e1] mb-1.5 md:mb-2 line-clamp-2 group-hover:text-[#ffd700] transition-colors duration-300">
            {title}
        </h3>
    );
}