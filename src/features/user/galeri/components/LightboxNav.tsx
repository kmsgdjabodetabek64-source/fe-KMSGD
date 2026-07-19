import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface LightboxNavProps {
    onPrevious: () => void;
    onNext: () => void;
}

export const LightboxNav = ({ onPrevious, onNext }: LightboxNavProps) => {
    return (
        <>
            {/* Mobile: statis di bawah gambar | Desktop: absolute di kiri layar */}
            <button
                type="button"
                aria-label="Foto sebelumnya"
                className="h-11 w-11 sm:h-12 sm:w-12 border border-[#ffd700]/70 bg-[#131313]/90 text-[#ffd700] active:bg-[#ffd700] active:text-[#131313] sm:hover:bg-[#ffd700] sm:hover:text-[#131313] transition-colors flex items-center justify-center sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2 z-40"
                onClick={onPrevious}
            >
                <MdChevronLeft className="text-3xl" />
            </button>

            <button
                type="button"
                aria-label="Foto berikutnya"
                className="h-11 w-11 sm:h-12 sm:w-12 border border-[#ffd700]/70 bg-[#131313]/90 text-[#ffd700] active:bg-[#ffd700] active:text-[#131313] sm:hover:bg-[#ffd700] sm:hover:text-[#131313] transition-colors flex items-center justify-center sm:absolute sm:right-6 sm:top-1/2 sm:-translate-y-1/2 z-40"
                onClick={onNext}
            >
                <MdChevronRight className="text-3xl" />
            </button>
        </>
    );
};