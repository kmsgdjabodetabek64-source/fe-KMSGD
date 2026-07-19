import { VisiCard } from "./VisiCard";
import { MisiCard } from "./MisiCard";

export function VisiMisiSection() {
    return (
        <section className="py-12 px-4 mt-8 md:py-20 md:px-6 md:mt-15 max-w-7xl mx-auto border-t border-[#2a2a2a]">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <VisiCard />
                <MisiCard />
            </div>
        </section>
    );
}