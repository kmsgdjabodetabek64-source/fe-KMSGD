import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#131313] text-[#e5e2e1] font-['Inter'] min-h-screen flex flex-col items-center justify-center px-6 text-center">

            <div className="text-[#ffd700] text-8xl font-bold font-['Montserrat'] mb-4">
                404
            </div>

            <div className="w-24 h-1 bg-[#ffd700] mb-8 mx-auto" />

            <h1 className="text-2xl md:text-3xl font-bold font-['Montserrat'] text-[#e5e2e1] mb-4">
                Halaman Tidak Ditemukan
            </h1>

            <p className="text-[#d0c6ab] text-base leading-relaxed max-w-md mb-10">
                Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                Silakan kembali ke beranda.
            </p>

            <button
                onClick={() => navigate("/")}
                className="bg-[#ffd700] text-[#131313] font-bold text-sm px-8 py-3 hover:bg-[#e9c400] transition-colors active:scale-95"
            >
                Kembali ke Beranda
            </button>

        </div>
    );
};

export default NotFoundPage;