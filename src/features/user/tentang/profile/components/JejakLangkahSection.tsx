import RevealItem from "@/components/RevealItem";

export function JejakLangkahSection() {
    return (
        <section className="py-12 px-4 md:py-20 md:px-6 max-w-7xl mx-auto border-t border-[#2a2a2a]">
            <RevealItem animation="animate-fade-in-up">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700] mb-6 md:mb-10 text-center">
                    <span className="text-white">Jejak</span> Langkah
                </h2>
            </RevealItem>

            <RevealItem animation="animate-fade-in-up" delay={80}>
                <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6 text-[#d0c6ab] text-sm sm:text-base md:text-lg leading-relaxed">
                    <p>
                        KMSGD lahir dari sebuah visi besar untuk menciptakan wadah kolaborasi, inovasi,
                        dan pengabdian yang nyata. Sejak awal berdiri, organisasi ini terus berkomitmen
                        menjadi jembatan bagi pengembangan potensi, kreativitas, serta karakter kepemimpinan
                        yang adaptif terhadap pesatnya perkembangan zaman.
                    </p>
                    <p>
                        Melalui berbagai program kerja strategis, aksi sosial, dan kolaborasi lintas generasi,
                        setiap jejak langkah yang telah diukir bukan sekadar cerita masa lalu. Ini adalah fondasi
                        berkelanjutan untuk terus memberikan dampak positif bagi masyarakat, menjaga nilai-nilai
                        kekeluargaan yang erat, dan menginspirasi lahirnya masa depan yang lebih gemilang.
                    </p>
                </div>
            </RevealItem>
        </section>
    );
}