import { Link } from "react-router-dom";
import RevealItem from "@/components/RevealItem";

export default function CTASection() {
    return (
        <section className="py-24 px-6 bg-[#FFD700] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 border-4 border-[#1A1A1A] rotate-12" />
                <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-[#1A1A1A] -rotate-12" />
            </div>
            <div className="max-w-7xl mx-auto text-center relative z-10">
                <RevealItem animation="animate-fade-in-up">
                    <h2 className="text-3xl md:text-5xl font-bold font-['Montserrat'] text-[#1A1A1A] mb-4">
                        Siap Berkontribusi &amp; Tumbuh Bersama?
                    </h2>
                </RevealItem>
                <RevealItem animation="animate-fade-in-up" delay={100}>
                    <p className="text-[#3a3000] text-lg mb-8 max-w-2xl mx-auto">
                        Jadilah bagian dari keluarga besar KMSGD Jabodetabek. Bersama kita belajar, berkarya, dan mengabdi.
                    </p>
                </RevealItem>
                <RevealItem animation="animate-fade-in-up" delay={200}>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfe6zDaBdzQFCyMfCg0jaDJH427YSm5CGLwaPXrYksx4_BMXg/viewform?usp=publish-editor" className="bg-[#1A1A1A] text-[#FFD700] font-bold px-10 py-4 uppercase tracking-wider hover:bg-[#2D2D2D] transition-colors text-sm cursor-pointer">
                            Daftar Sekarang
                        </a>
                        <Link to="/kontak" className="border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold px-10 py-4 uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-[#FFD700] transition-colors text-sm cursor-pointer">
                            Hubungi Kami
                        </Link>
                    </div>
                </RevealItem>
            </div>
        </section>
    );
}