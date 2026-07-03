import { useQuery } from "@tanstack/react-query";
import { getActiveHomeBackgrounds } from "../../services/homeBackgroundService";
import RevealItem from "@/components/RevealItem";
import { useState, useEffect } from "react";

export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: bgImages = [] } = useQuery({
        queryKey: ["home-background-active"],
        queryFn: async () => {
            const res = await getActiveHomeBackgrounds();
            return res.map((item) => item.image).filter(Boolean);
        },
        staleTime: 5 * 60_000, // background jarang berubah, cache 5 menit
    });

    useEffect(() => {
        if (bgImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % bgImages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [bgImages]);

    return (
        <section className="relative min-h-dvh flex items-center px-6 md:px-12 pt-24 md:pt-28 pb-12 md:pb-16">
            <div className="absolute inset-0 z-0 bg-[#131313] overflow-hidden">
                {bgImages.map((src, index) => (
                    <img
                        key={`${src}-${index}`}
                        src={src}
                        alt=""
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-20" : "opacity-0"
                            }`}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                    />
                ))}
                {/* Mobile pakai gradien atas-bawah agar teks di tengah kontras, Desktop kembali pakai gradien bawaan Anda */}
                <div className="absolute inset-0 bg-linear-to-b from-[#131313]/90 via-[#131313]/70 to-[#131313] md:bg-linear-to-r md:from-[#131313] md:via-[#131313]/90 md:to-transparent" />
            </div>

            {/* Struktur Container Utama kembali normal seperti semula */}
            <div className="max-w-7xl mx-auto w-full relative z-10">
                {/* Rata tengah di mobile (items-center text-center), kembali ke normal di desktop (md:items-start md:text-left) */}
                <div className="max-w-2xl flex flex-col items-center text-center md:items-start md:text-left gap-4 md:gap-6">
                    <RevealItem animation="animate-fade-in-up">
                        <h1 className="flex flex-col items-center md:items-start text-4xl md:text-6xl font-bold font-['Montserrat'] text-[#e5e2e1] leading-tight mt-1 md:mt-0">
                            Keluarga Mahasiswa Sunan Gunung Djati{" "}
                            <span className="text-[#ffd700]">Jabodetabek</span>
                        </h1>
                    </RevealItem>

                    <RevealItem animation="animate-fade-in-up" delay={150}>
                        {/* mx-auto agar paragraf di tengah saat mobile, md:mx-0 mengembalikannya ke kiri saat desktop */}
                        <p className="text-[#d0c6ab] text-sm md:text-lg leading-relaxed max-w-[90%] md:max-w-xl mx-auto md:mx-0">
                            Wadah silaturahmi, kolaborasi, dan pengembangan diri bagi mahasiswa Sunan Gunung Djati
                            di kawasan metropolitan Jabodetabek.
                        </p>
                    </RevealItem>

                    <RevealItem animation="animate-fade-in-up" delay={300}>
                        <div className="mt-2 md:mt-4">
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfe6zDaBdzQFCyMfCg0jaDJH427YSm5CGLwaPXrYksx4_BMXg/viewform?usp=dialog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 bg-[#ffd700] px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold text-[#131313] shadow-lg shadow-[#ffd700]/20 transition-all duration-300 hover:bg-[#e5c200] hover:shadow-xl hover:shadow-[#ffd700]/30 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131313]"
                            >
                                Daftar Sekarang
                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </a>
                        </div>
                    </RevealItem>
                </div>
            </div>

            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
                <span className="text-[#FFD700] text-xl md:text-2xl">↓</span>
            </div>
        </section>
    );
}