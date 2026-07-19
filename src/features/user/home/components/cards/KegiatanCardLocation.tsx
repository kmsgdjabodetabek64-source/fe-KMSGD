interface KegiatanCardLocationProps {
    location: string;
}

export function KegiatanCardLocation({ location }: KegiatanCardLocationProps) {
    return (
        <div className="flex items-center gap-1.5 text-[#666] min-w-0">
            <svg className="w-3 h-3 shrink-0 text-[#ffd700]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[10px] md:text-xs uppercase tracking-wide font-medium truncate">
                {location}
            </span>
        </div>
    );
}