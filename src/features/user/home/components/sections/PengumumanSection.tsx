import { useQuery } from "@tanstack/react-query";
import PengumumanCard from "../../../../../components/PengumumanCard";
import { getLatestPengumuman } from "../../../pengumuman/services/pengumumanService";
import { Link } from "react-router-dom";
import RevealItem from "@/components/RevealItem";

export default function PengumumanSection() {
    const { data: latest = [] } = useQuery({
        queryKey: ["pengumuman-latest", 3],
        queryFn: ({ signal }) => getLatestPengumuman(3, signal),
        staleTime: 5 * 60_000,
        gcTime: 10 * 60_000,
    });

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-end mb-12 border-b border-[#353535] pb-4 px-6">
                <div>
                    <RevealItem animation="animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700] mb-2">
                            <span className="text-white">Pengumuman</span>
                        </h2>
                    </RevealItem>
                    <RevealItem animation="animate-fade-in-up" delay={80}>
                        <p className="text-[#d0c6ab] text-base">Momen kebersamaan dan aksi nyata KMSGD.</p>
                    </RevealItem>
                </div>
                <Link to="/pengumuman" className="text-[#ffd700] text-sm font-semibold hidden md:flex items-center gap-1 hover:underline cursor-pointer">
                    Lihat Semua ↗
                </Link>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                {latest.map((item, i) => (
                    <RevealItem
                        key={item.id}
                        animation="animate-fade-in-up"
                        delay={i * 60}
                    >
                        <PengumumanCard item={item} />
                    </RevealItem>
                ))}
            </div>
        </section>
    );
}