import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
    showAll: boolean;
    onToggle: () => void;
}

export default function ShowMoreButton({ showAll, onToggle }: Props) {
    return (
        <div className="flex justify-center mt-10">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-6 py-3 border border-[#ffd700]/40 text-[#ffd700] hover:bg-[#ffd700] hover:text-black transition duration-300"
            >
                {showAll ? (
                    <>Lihat Lebih Sedikit <ChevronUp size={18} /></>
                ) : (
                    <>Lihat Selengkapnya <ChevronDown size={18} /></>
                )}
            </button>
        </div>
    );
}