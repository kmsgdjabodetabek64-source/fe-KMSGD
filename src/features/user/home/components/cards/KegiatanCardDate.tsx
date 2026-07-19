interface KegiatanCardDateProps {
    date: string;
}

export function KegiatanCardDate({ date }: KegiatanCardDateProps) {
    return (
        <time className="text-[10px] md:text-xs text-[#777] uppercase tracking-widest mb-1.5">
            {date}
        </time>
    );
}