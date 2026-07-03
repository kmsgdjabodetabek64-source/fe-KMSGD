import { MdChevronLeft, MdChevronRight, MdClose } from "react-icons/md";
import type { GaleriItem } from "../services/galeriService";

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
            {/* TOMBOL CLOSE */}
            <button
                type="button"
                aria-label="Tutup preview"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 border border-[#ffd700] bg-[#131313] text-[#ffd700] hover:bg-[#ffd700] hover:text-[#131313] transition-colors z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <MdClose className="text-2xl" />
            </button>

            {/* [DESKTOP ONLY] TOMBOL KIRI KANAN KELUAR PADA LAYAR UTAMA */}
            {hasMultiplePhotos && (
                <>
                    <button
                        type="button"
                        aria-label="Foto sebelumnya"
                        className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 border border-[#ffd700]/70 bg-[#131313]/90 text-[#ffd700] hover:bg-[#ffd700] hover:text-[#131313] transition-colors z-40 items-center justify-center"
                        onClick={() => onNavigate(previousIndex)}
                    >
                        <MdChevronLeft className="text-3xl" />
                    </button>

                    <button
                        type="button"
                        aria-label="Foto berikutnya"
                        className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 border border-[#ffd700]/70 bg-[#131313]/90 text-[#ffd700] hover:bg-[#ffd700] hover:text-[#131313] transition-colors z-40 items-center justify-center"
                        onClick={() => onNavigate(nextIndex)}
                    >
                        <MdChevronRight className="text-3xl" />
                    </button>
                </>
            )}

            {/* KONTEN UTAMA GAMBAR & FOOTER PREVIEW */}
            <figure className="w-full max-w-5xl max-h-[82vh] sm:max-h-[86vh] flex flex-col items-center gap-3">
                <img
                    src={currentPhoto.url}
                    alt={currentPhoto.judul || "Preview foto galeri"}
                    className="max-w-full max-h-[65vh] sm:max-h-[80vh] object-contain border-2 border-[#ffd700] bg-[#0f0f0f]"
                    decoding="async"
                />

                <figcaption className="max-w-full text-center text-sm text-[#d0c6ab] px-4 sm:px-12">
                    {currentPhoto.judul || `Foto ${currentIndex + 1} dari ${photos.length}`}
                </figcaption>

                {/* [MOBILE ONLY] TOMBOL KIRI KANAN BERADA DI BAWAH GAMBAR */}
                {hasMultiplePhotos && (
                    <div className="flex sm:hidden items-center justify-center gap-6 mt-1 z-40">
                        <button
                            type="button"
                            aria-label="Foto sebelumnya"
                            className="h-11 w-11 border border-[#ffd700]/70 bg-[#131313]/90 text-[#ffd700] active:bg-[#ffd700] active:text-[#131313] transition-colors flex items-center justify-center"
                            onClick={() => onNavigate(previousIndex)}
                        >
                            <MdChevronLeft className="text-3xl" />
                        </button>
                        <button
                            type="button"
                            aria-label="Foto berikutnya"
                            className="h-11 w-11 border border-[#ffd700]/70 bg-[#131313]/90 text-[#ffd700] active:bg-[#ffd700] active:text-[#131313] transition-colors flex items-center justify-center"
                            onClick={() => onNavigate(nextIndex)}
                        >
                            <MdChevronRight className="text-3xl" />
                        </button>
                    </div>
                )}
            </figure>
        </div>
    );
};