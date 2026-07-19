import RevealItem from "@/components/RevealItem";

export function VisiCard() {
    return (
        <RevealItem animation="animate-slide-in-left">
            <div className="bg-[#20201f] border-t-[3px] border-[#ffd700] p-6 md:p-8">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <span className="text-[#ffd700] text-3xl md:text-4xl">👁</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700]">
                        Visi
                    </h2>
                </div>
                <p className="text-[#e5e2e1] text-base md:text-lg leading-relaxed">
                    Mewujudkan wadah kekeluargaan yang solid, progresif, dan
                    berintegritas bagi mahasiswa Sunan Gunung Djati di Jabodetabek,
                    serta menjadi inisiator perubahan positif bagi masyarakat.
                </p>
            </div>
        </RevealItem>
    );
}