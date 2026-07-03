interface HeaderDetailProps {
    judul: string;
    judul2?: string;
    deskripsi: string;
    bgImage?: string;
}

export default function HeaderDetail({ judul, judul2, deskripsi, bgImage = '/bg-default.jpg' }: HeaderDetailProps) {
    return (
        <div className="relative min-h-87.5 flex items-end -mx-6 -mt-30 mb-12 px-6 pt-30 pb-12 overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${bgImage}')` }}
            />
            {/* Overlay gelap */}
            <div className="absolute inset-0 bg-black/60" />
            {/* Blur fade bawah */}
            <div className="absolute bottom-0 left-0 right-0 h-24 backdrop-blur-sm bg-linear-to-b from-transparent to-[#131313]" />

            {/* Konten */}
            <div className="relative z-10 w-full max-w-7xl">
                <h1 className="text-5xl md:text-6xl font-bold font-['Montserrat'] leading-tight mb-4">
                    <span className="text-[#e5e2e1]">{judul}</span>{' '}
                    <span className="text-[#ffd700]">{judul2}</span>
                </h1>
                <p className="text-[#d0c6ab] text-lg leading-relaxed max-w-2xl">
                    {deskripsi}
                </p>
            </div>
        </div>
    );
}