import RevealItem from "@/components/RevealItem";

const MISI_ITEMS = [
    "Mempererat tali silaturahmi antar anggota melalui kegiatan rutin dan insidental.",
    "Mengembangkan potensi akademik dan non-akademik anggota secara berkelanjutan.",
    "Berperan aktif dalam pengabdian masyarakat di lingkungan Jabodetabek.",
    "Menjalin sinergi dengan instansi dan organisasi lain yang sejalan.",
];

export function MisiCard() {
    return (
        <RevealItem animation="animate-slide-in-right" delay={60}>
            <div className="bg-[#20201f] border-t-[3px] border-[#ffd700] p-6 md:p-8">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <span className="text-[#ffd700] text-3xl md:text-4xl">🚩</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700]">
                        Misi
                    </h2>
                </div>
                <ul className="text-[#e5e2e1] text-sm sm:text-base leading-relaxed space-y-3 md:space-y-4 list-disc list-inside">
                    {MISI_ITEMS.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </div>
        </RevealItem>
    );
}