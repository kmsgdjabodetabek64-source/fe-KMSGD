import { useQuery } from "@tanstack/react-query";
import KegiatanCard from "../cards/KegiatanCard";
import { getLatestKegiatan } from "../../../kegiatan/services/kegiatanService";
import { Link } from "react-router-dom";
import RevealItem from "@/components/RevealItem";

export default function FokusKegiatanSection() {
    const { data: latest = [] } = useQuery({
        queryKey: ["kegiatan-latest", 3],
        queryFn: ({ signal }) => getLatestKegiatan(3, signal),
        staleTime: 5 * 60_000,
        gcTime: 10 * 60_000,
    });

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">

            <header className="flex justify-between items-end mb-12 border-b border-[#353535] pb-4">
                <div>
                    <RevealItem animation="animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700] mb-2">
                            <span className="text-white">Fokus</span> Kegiatan
                        </h2>
                    </RevealItem>
                    <RevealItem animation="animate-fade-in-up" delay={80}>
                        <p className="text-[#d0c6ab] text-base">
                            Pilar utama pergerakan organisasi kami.
                        </p>
                    </RevealItem>
                </div>

                <Link
                    to="/kegiatan"
                    className="text-[#ffd700] text-sm font-semibold hidden md:flex items-center gap-1 hover:underline cursor-pointer"
                >
                    Lihat Semua ↗
                </Link>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {latest.map((item, i) => (
                    <RevealItem
                        key={item.id ?? i}
                        animation="animate-fade-in-up"
                        delay={i * 60}
                    >
                        <KegiatanCard
                            id={item.id}
                            img={item.image}
                            title={item.title}
                            desc={item.desc}
                            date={item.date}
                            category={item.category}
                            location={item.location}
                        />
                    </RevealItem>
                ))}
            </div>

        </section>
    );
}