import { MdClose } from "react-icons/md";
import type { GaleriItem } from "../services/galeriService";
import { LightboxImage } from "./LightboxImage";
import { LightboxNav } from "./LightboxNav";

interface LightboxProps {
    photos: GaleriItem[];
    currentIndex: number | null;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export const Lightbox = ({ photos, currentIndex, onClose, onNavigate }: LightboxProps) => {
    if (currentIndex === null || photos.length === 0) return null;

    const currentPhoto = photos[currentIndex];
    if (!currentPhoto) return null;

    const hasMultiplePhotos = photos.length > 1;
    const previousIndex = (currentIndex - 1 + photos.length) % photos.length;
    const nextIndex = (currentIndex + 1) % photos.length;

    return (
        <div
            className="fixed inset-0 bg-[#131313]/95 z-50 flex items-center justify-center px-4 py-6 sm:p-8 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Preview foto galeri"
        >
            <button
                type="button"
                aria-label="Tutup preview"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 border border-[#ffd700] bg-[#131313] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#131313] transition-colors z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <MdClose className="text-2xl" />
            </button>

            <div className="w-full max-w-5xl flex flex-col items-center gap-3">
                <LightboxImage photo={currentPhoto} index={currentIndex} total={photos.length} />

                {hasMultiplePhotos && (
                    <div className="flex sm:contents items-center justify-center gap-6">
                        <LightboxNav
                            onPrevious={() => onNavigate(previousIndex)}
                            onNext={() => onNavigate(nextIndex)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};