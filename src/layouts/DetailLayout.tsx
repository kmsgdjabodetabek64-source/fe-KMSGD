import React from "react";

interface DetailLayoutProps {
    children: React.ReactNode;
    judul: string;
    judul2?: string;
    deskripsi: string;
    bgImage?: string;
}

export default function DetailLayout({ children, judul, judul2, deskripsi, bgImage = "/bg.webp" }: DetailLayoutProps) {
    const safeBgImage = bgImage.startsWith("/") || bgImage.startsWith("https://") ? bgImage : "/bg.webp";

    return (
        <div className="bg-[#131313] text-[#e5e2e1] font-['Inter'] min-h-screen">
            <div className="relative w-full min-h-87.5 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${safeBgImage}')` }}
                />
                <div className="absolute inset-0 bg-black/65" />
                <div
                    className="absolute bottom-0 left-0 right-0 h-40 backdrop-blur-md bg-[#131313]/15"
                    style={{
                        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
                        maskImage: "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
                    }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent via-[#131313]/75 to-[#131313]" />

                <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-40 mb-15">
                    <h1 className="text-5xl md:text-6xl font-bold font-['Montserrat'] leading-tight mb-4">
                        <span className="text-[#e5e2e1]">{judul}</span>{" "}
                        {judul2 && <span className="text-[#ffd700]">{judul2}</span>}
                    </h1>
                    <p className="text-[#d0c6ab] text-lg leading-relaxed max-w-2xl">
                        {deskripsi}
                    </p>
                </section>
            </div>

            <main className="w-full max-w-7xl mx-auto px-6 pb-20">
                {children}
            </main>
        </div>
    );
}
