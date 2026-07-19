import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface LightboxMobileNavProps {
    onPrevious: () => void;
    onNext: () => void;
}

export const LightboxMobileNav = ({ onPrevious, onNext }: LightboxMobileNavProps) => {
    return (
        <div className="flex sm:hidden items-center justify-center gap-6 mt-1 z-40">
            <button
                type="button"
                aria-label="Foto sebelumnya"
                className="h-11 w-11 border border-[#ffd700]/70 bg-[#131313]/90 text-[#ffd700] active:bg-[#ffd700] active:text-[#131313] transition-colors flex items-center justify-center"
                onClick={onPrevious}
            >
                <MdChevronLeft className="text-3xl" />
            </button>
            <button
                type="button"
                aria-label="Foto berikutnya"
                className="h-11 w-11 border border-[#ffd700]/70 bg-[#131313]/90 text-[#ffd700] active:bg-[#ffd700] active:text-[#131313] transition-colors flex items-center justify-center"
                onClick={onNext}
            >
                <MdChevronRight className="text-3xl" />
            </button>
        </div>
    );
};