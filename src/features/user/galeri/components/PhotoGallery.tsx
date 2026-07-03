import type { GaleriItem } from "../services/galeriService";
import { LoadingSpinner } from "./LoadingSpinner";
import RevealItem from "@/components/RevealItem";
import { useShowMore } from "@/hooks/useShowMore";
import ShowMoreButton from "@/components/ShowMoreButton";

interface PhotoGalleryProps {
    photos: GaleriItem[];
    loading: boolean;
    onPhotoClick: (index: number) => void;
}

export const PhotoGallery = ({ photos, loading, onPhotoClick }: PhotoGalleryProps) => {
    const { visibleItems, showAll, hasMore, toggle } = useShowMore(photos, 6);

    if (loading) return <LoadingSpinner />;

    return (
        <section className="pb-20 px-6 max-w-7xl mx-auto w-full">
            <RevealItem animation="animate-fade-in-up">
                <h2 className="text-xl font-bold font-['Montserrat'] text-[#ffd700] flex items-center gap-2 mb-6">
                    Galeri Foto
                </h2>
            </RevealItem>

            {photos.length === 0 ? (
                <p className="text-gray-400 italic">Belum ada foto yang diunggah.</p>
            ) : (
                <RevealItem animation="animate-fade-in">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {visibleItems.map((photo, index) => (
                            <button
                                type="button"
                                key={photo.id}
                                className="relative group cursor-pointer overflow-hidden border border-[#353535] bg-[#0f0f0f] text-left aspect-4/3 sm:aspect-5/4 hover:border-[#ffd700] transition-colors duration-300"
                                onClick={() => onPhotoClick(index)}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.judul || "Galeri Foto"}
                                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="absolute inset-0 bg-[#131313]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center border-2 border-[#ffd700]">
                                    <span className="text-[#ffd700] text-xs sm:text-sm font-bold uppercase tracking-[2px]">
                                        Preview
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </RevealItem>
            )}

            {hasMore && (
                <div className="flex justify-center mt-8">
                    <ShowMoreButton showAll={showAll} onToggle={toggle} />
                </div>
            )}
        </section>
    );
};
