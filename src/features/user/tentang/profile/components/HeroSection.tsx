import RevealItem from "@/components/RevealItem";

export function HeroSection() {
    return (
        <section className="mb-2">
            <RevealItem animation="animate-fade-in-up">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-['Montserrat'] text-[#ffd700] mb-4 leading-tight">
                    <span className="text-white">Profil</span> Organisasi
                </h1>
            </RevealItem>
            <RevealItem animation="animate-fade-in-up" delay={150}>
                <p className="text-[#d0c6ab] text-base sm:text-lg leading-relaxed max-w-3xl">
                    Mengenal lebih dekat identitas, sejarah, dan arah gerak Keluarga
                    Mahasiswa Sunan Gunung Djati di wilayah Jabodetabek.
                </p>
            </RevealItem>
        </section>
    );
}