import RevealItem from "@/components/RevealItem";

export const GalleryHero = () => {
    return (
        <section className="py-20 px-6 max-w-7xl mx-auto text-center">
            <RevealItem animation="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold font-['Montserrat'] text-[#ffd700] mb-4">
                    <span className="text-white">Momen</span> Kami
                </h1>
            </RevealItem>
            <RevealItem animation="animate-fade-in-up" delay={150}>
                <p className="text-[#d0c6ab] text-lg leading-relaxed max-w-2xl mx-auto">
                    Koleksi visual perjalanan, kegiatan, dan kebersamaan KMSGD Jabodetabek.
                    Menangkap setiap langkah dalam membangun komunitas yang kuat dan inspiratif.
                </p>
            </RevealItem>
        </section>
    );
};