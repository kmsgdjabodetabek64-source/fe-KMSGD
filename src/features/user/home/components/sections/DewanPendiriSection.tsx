import { homeFounders } from "../../services/homeService";
import RevealItem from "@/components/RevealItem";

export default function DewanPendiriSection() {
    return (
        <section className="py-24 px-6 bg-[#0e0e0e] border-y border-[#353535]">
            <div className="max-w-7xl mx-auto">

                <header className="text-center mb-16">
                    <RevealItem animation="animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#20201f] border border-[#353535] text-[#d0c6ab] text-xs font-semibold tracking-widest mb-6">
                            ✦ Legacy &amp; Honor
                        </div>
                    </RevealItem>

                    <RevealItem animation="animate-fade-in-up" delay={60}>
                        <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#FFD700] mb-4">
                            <span className="text-white">Dewan</span> Pendiri KMSGD
                        </h2>
                    </RevealItem>

                    <RevealItem animation="animate-fade-in-up" delay={120}>
                        <p className="text-[#d0c6ab] text-base max-w-2xl mx-auto">
                            Mengenang jasa para pendiri yang telah meletakkan dasar perjuangan dan nilai-nilai luhur organisasi ini.
                        </p>
                    </RevealItem>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {homeFounders.map((person, i) => (
                        <RevealItem
                            key={person.nama}
                            animation="animate-fade-in-up"
                            delay={i * 60}
                        >
                            <figure className="group text-center m-0">
                                <div className="relative overflow-hidden border-2 border-transparent hover:border-[#FFD700] transition-all duration-300 mb-4">
                                    <img
                                        src={person.img}
                                        alt={person.nama}
                                        className="w-full aspect-3/4 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <figcaption>
                                    <h4 className="text-[#FFD700] font-bold font-['Montserrat'] text-base mb-1">
                                        {person.nama}
                                    </h4>

                                    <p className="text-[#d0c6ab] text-xs tracking-wider uppercase">
                                        {person.peran}
                                    </p>

                                    <p className="text-[#d0c6ab]/60 text-xs mt-1">
                                        {person.tahun}
                                    </p>
                                </figcaption>
                            </figure>
                        </RevealItem>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <p className="text-[#d0c6ab]/50 text-xs italic">
                        "Al-Fatihah untuk para pendiri yang telah berpulang. Jasa mu abadi dalam sanubari kami."
                    </p>
                </div>

            </div>
        </section>
    );
}