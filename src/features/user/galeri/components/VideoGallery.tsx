import type { GaleriItem } from "../services/galeriService";
import { LoadingSpinner } from "./LoadingSpinner";
import RevealItem from "@/components/RevealItem";
import { useShowMore } from "@/hooks/useShowMore";
import ShowMoreButton from "@/components/ShowMoreButton";

interface VideoGalleryProps {
    videos: GaleriItem[];
    loading: boolean;
}

export const VideoGallery = ({ videos, loading }: VideoGalleryProps) => {
    const { visibleItems, showAll, hasMore, toggle } = useShowMore(videos, 4);

    if (loading) return <LoadingSpinner />;

    return (
        <section className="bg-[#20201f] py-20 border-y border-[#353535]">
            <div className="px-6 max-w-7xl mx-auto">
                <RevealItem animation="animate-fade-in-up">
                    <h2 className="text-xl font-bold font-['Montserrat'] text-[#ffd700] flex items-center gap-2 mb-8">
                        ▶ Dokumentasi Video
                    </h2>
                </RevealItem>

                {videos.length === 0 ? (
                    <p className="text-gray-400 italic">Belum ada video yang diunggah.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {visibleItems.map((video, i) => (
                            <RevealItem
                                key={video.id}
                                animation="animate-fade-in-up"
                                delay={i * 60}
                            >
                                <div
                                    className="bg-[#131313] rounded overflow-hidden border border-[#353535] hover:border-[#ffd700] transition-colors duration-300 group cursor-pointer"
                                    onClick={() => window.open(video.url, "_blank", "noopener,noreferrer")} // Aman dari tabjacking
                                >
                                    <div className="relative aspect-video bg-[#131313] flex items-center justify-center">
                                        <img
                                            src={video.thumbnail || "https://via.placeholder.com/640x360?text=Video"}
                                            alt={video.judul || "Video Thumbnail"}
                                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                        />
                                        <div className="relative z-10 w-16 h-16 bg-[#ffd700] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                                            <span className="text-[#131313] text-2xl ml-1">▶</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold font-['Montserrat'] text-[#e5e2e1] mb-2 group-hover:text-[#ffd700] transition-colors">
                                            {video.judul || "Dokumentasi Video"}
                                        </h3>
                                    </div>
                                </div>
                            </RevealItem>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="flex justify-center mt-10">
                        <ShowMoreButton showAll={showAll} onToggle={toggle} />
                    </div>
                )}
            </div>
        </section>
    );
};