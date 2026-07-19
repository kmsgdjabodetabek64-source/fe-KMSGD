import { Link } from "react-router-dom";

interface KegiatanCardDetailLinkProps {
    id: number;
}

export function KegiatanCardDetailLink({ id }: KegiatanCardDetailLinkProps) {
    return (
        <Link
            to={`/kegiatan/detail/${id}`}
            className="group/link text-[#ffd700] text-xs md:text-sm font-semibold hover:underline shrink-0 ml-2 inline-flex items-center gap-1"
        >
            Detail
            <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1">→</span>
        </Link>
    );
}