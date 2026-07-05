import { useQuery } from "@tanstack/react-query";
import { getSambutan } from "../../../../../service/sambutanService";
import RevealItem from "@/components/RevealItem";

export default function KetuaSection() {
    const { data: sambutan, isLoading } = useQuery({
        queryKey: ["sambutan"],
        queryFn: getSambutan,
        staleTime: 5 * 60_000,
        gcTime: 10 * 60_000,
    });

    if (isLoading) {
        return (
            <section className="py-16 px-6 max-w-7xl mx-auto flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700]" />
            </section>
        );
    }

    if (!sambutan) return null;

    return (
        <section className="py-10 px-4 sm:py-16 sm:px-6 max-w-7xl mx-auto">

            <div className="bg-[#20201f] border-l-4 border-[#ffd700] p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-8 items-center">

                <RevealItem animation="animate-slide-in-left" className="w-full max-w-xs md:w-72 flex shrink-0">
                    <div className="aspect-4/5 w-full border border-[#353535] relative group overflow-hidden">
                        <img
                            src={sambutan.image ?? "/bg.webp"}
                            alt="Ketua Umum"
                            className="w-full h-full object-cover md:grayscale md:group-hover:grayscale-0 transition-all duration-500"
                            loading="lazy"
                            decoding="async"
                        />

                        <div className="absolute bottom-4 left-4 right-4 bg-[#131313] px-4 py-2 border border-[#ffd700]">
                            <div className="text-[#ffd700] font-bold font-['Montserrat'] text-base truncate">
                                {sambutan.nama}
                            </div>
                            <div className="text-[#d0c6ab] text-xs font-semibold tracking-wide truncate">
                                {sambutan.jabatan}
                            </div>
                        </div>
                    </div>
                </RevealItem>

                <RevealItem animation="animate-slide-in-right" className="flex flex-col gap-4 flex-1">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#e5e2e1]">
                        Sambutan Ketua Umum
                    </h2>

                    <div className="w-16 h-1 bg-[#ffd700]" />

                    <blockquote className="text-[#d0c6ab] text-base sm:text-lg leading-relaxed italic whitespace-pre-wrap m-0">
                        "{sambutan.isi}"
                        <cite className="sr-only">{sambutan.nama}, {sambutan.jabatan}</cite>
                    </blockquote>
                </RevealItem>

            </div>

        </section>
    );
}