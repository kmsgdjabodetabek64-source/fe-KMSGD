import { KegiatanCardLocation } from "./KegiatanCardLocation";
import { KegiatanCardDetailLink } from "./KegiatanCardDetailLink";

interface KegiatanCardFooterProps {
    id: number;
    location: string;
}

export function KegiatanCardFooter({ id, location }: KegiatanCardFooterProps) {
    return (
        <div className="flex items-center justify-between pt-2 border-t border-[#353535] group-hover:border-[#4d4732] transition-colors duration-300">
            <KegiatanCardLocation location={location} />
            <KegiatanCardDetailLink id={id} />
        </div>
    );
}