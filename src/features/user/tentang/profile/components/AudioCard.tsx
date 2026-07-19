import RevealItem from "@/components/RevealItem";

interface AudioCardProps {
    title: string;
    src: string;
    delay?: number;
}

export function AudioCard({ title, src, delay = 0 }: AudioCardProps) {
    return (
        <RevealItem animation="animate-fade-in-up" delay={delay}>
            <div className="bg-[#20201f] border border-[#ffd700] p-5 md:p-6 flex flex-col justify-center gap-3 md:gap-4">
                <h3 className="text-lg md:text-xl font-bold font-['Montserrat'] text-[#e5e2e1] mb-2">
                    {title}
                </h3>
                <audio controls className="w-full outline-none filter dark:invert dark:hue-rotate-180">
                    <source src={src} type="audio/mpeg" />
                    Browser Anda tidak mendukung pemutaran audio.
                </audio>
            </div>
        </RevealItem>
    );
}