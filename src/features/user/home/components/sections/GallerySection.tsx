import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getGaleri } from "../../../galeri/services/galeriService";
import RevealItem from "@/components/RevealItem";

export default function GallerySection() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const isPausedRef = useRef(false);
    const speed = 1.5;

    const { data, isLoading } = useQuery({
        queryKey: ["galeri-home"],
        queryFn: () => getGaleri("FOTO", 1, 10),
        staleTime: 5 * 60_000,
        gcTime: 10 * 60_000,
    });

    const photos = data?.data.map((item) => item.url) ?? [];

    let displayPhotos = [...photos];
    if (displayPhotos.length > 0) {
        while (displayPhotos.length < 10) {
            displayPhotos = [...displayPhotos, ...photos];
        }
    }

    const doubled = [...displayPhotos, ...displayPhotos];

    useEffect(() => {
        if (isLoading || photos.length === 0) return;

        const wrap = wrapRef.current;
        if (!wrap) return;

        const autoScroll = () => {
            if (!isPausedRef.current) {
                wrap.scrollLeft += speed;
                if (wrap.scrollLeft >= wrap.scrollWidth / 2) {
                    wrap.scrollLeft = 0;
                }
            }
            animationRef.current = requestAnimationFrame(autoScroll);
        };

        animationRef.current = requestAnimationFrame(autoScroll);

        const handleVisibility = () => {
            isPausedRef.current = document.hidden;
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [isLoading, photos.length]);

    if (!isLoading && photos.length === 0) return null;

    return (
        <section className="py-24 bg-[#0e0e0e] border-y border-[#353535] overflow-hidden">
            <div className="max-w-7xl mx-auto">

                <header className="flex justify-between items-end mb-12 border-b border-[#353535] pb-4 px-6">
                    <div>
                        <RevealItem animation="animate-fade-in-up">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700] mb-2">
                                <span className="text-white">Galeri</span> Kegiatan
                            </h2>
                        </RevealItem>
                        <RevealItem animation="animate-fade-in-up" delay={80}>
                            <p className="text-[#d0c6ab] text-base">
                                Momen kebersamaan dan aksi nyata KMSGD.
                            </p>
                        </RevealItem>
                    </div>

                    <Link
                        to="/galeri"
                        className="text-[#ffd700] text-sm font-semibold hidden md:flex items-center gap-1 hover:underline cursor-pointer"
                    >
                        Lihat Semua Foto ↗
                    </Link>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700]" />
                    </div>
                ) : (
                    <div
                        ref={wrapRef}
                        className="overflow-x-hidden select-none px-6 pointer-events-none"
                        style={{ scrollbarWidth: "none" }}
                    >
                        <div
                            className="flex gap-4 pr-4"
                            style={{ width: "max-content" }}
                        >
                            {doubled.map((src, idx) => (
                                <figure
                                    key={`${src}-${idx}`}
                                    className="group relative overflow-hidden shrink-0 w-55 md:w-70 aspect-square m-0"
                                >
                                    <img
                                        src={src}
                                        alt={`Kegiatan ${idx + 1}`}
                                        className="w-full h-full object-cover pointer-events-none"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </figure>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}