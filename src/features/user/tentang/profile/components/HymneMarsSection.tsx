import RevealItem from "@/components/RevealItem";
import { AUDIO_ITEMS } from "../../services/tentangService";
import { AudioCard } from "./AudioCard";

export function HymneMarsSection() {
    return (
        <section className="py-12 px-4 md:py-20 md:px-6 max-w-7xl mx-auto border-t border-[#2a2a2a]">
            <RevealItem animation="animate-fade-in-up">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700] mb-6 md:mb-8">
                    <span className="text-white">Hymne</span> &amp; Mars KMSGD
                </h2>
            </RevealItem>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {AUDIO_ITEMS.map((item, i) => (
                    <AudioCard key={item.src} title={item.title} src={item.src} delay={i * 60} />
                ))}
            </div>
        </section>
    );
}