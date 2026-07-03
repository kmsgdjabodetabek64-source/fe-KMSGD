import UserLayout from "@/layouts/UserLayout";
import FormUser from "../components/FormUser";
import PetaInteraktif from "../components/PetaInteraktif";
import RevealItem from "@/components/RevealItem";

const KontakPage = () => {
  return (
    <section className="bg-[#131313] text-[#e5e2e1] font-['Inter'] min-h-screen flex flex-col">
      <UserLayout>

        {/* HEADER */}
        <RevealItem animation="animate-fade-in-up" className="mb-12 sm:mb-20 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold font-['Montserrat'] text-[#ffd700] mb-3 sm:mb-4">
            Hubungi Kami
          </h1>
          <p className="text-[#d0c6ab] text-base sm:text-lg leading-relaxed">
            Kami selalu terbuka untuk berdiskusi, berkolaborasi, dan menjawab
            pertanyaan Anda seputar Keluarga Mahasiswa Sunan Gunung Djati wilayah
            Jabodetabek.
          </p>
        </RevealItem>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* KIRI: INFO + MAP */}
          <div className="lg:col-span-7 flex flex-col gap-6">

            {/* INFO CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Sekretariat */}
              <RevealItem animation="animate-fade-in-up" delay={80}>
                {/* Perbaikan: p-4 di mobile, p-6 di layar sm ke atas */}
                <div className="bg-[#20201f] border-t-[3px] border-[#ffd700] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                  {/* Perbaikan Icon: w-10 h-10 di mobile */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center border border-[#4d4732]">
                    <span className="text-[#ffd700] text-lg sm:text-xl">📍</span>
                  </div>
                  <div>
                    {/* Perbaikan Judul: text-lg di mobile */}
                    <h3 className="text-lg sm:text-xl font-bold font-['Montserrat'] text-[#e5e2e1] mb-1 sm:mb-2">
                      Sekretariat
                    </h3>
                    <p className="text-[#d0c6ab] text-xs sm:text-sm leading-relaxed">
                      Jl. Margonda Raya No. 100, Depok, Jawa Barat, Indonesia 16424
                    </p>
                  </div>
                </div>
              </RevealItem>

              {/* Komunikasi */}
              <RevealItem animation="animate-fade-in-up" delay={140}>
                <div className="bg-[#20201f] border-t-[3px] border-[#ffd700] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center border border-[#4d4732]">
                    <span className="text-[#ffd700] text-lg sm:text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold font-['Montserrat'] text-[#e5e2e1] mb-1 sm:mb-2">
                      Komunikasi
                    </h3>
                    <p className="text-[#d0c6ab] text-xs sm:text-sm">info@kmsgdjabodetabek.org</p>
                    <p className="text-[#d0c6ab] text-xs sm:text-sm mt-1">+62 812 3456 7890</p>
                  </div>
                </div>
              </RevealItem>

              {/* Media Sosial */}
              <RevealItem animation="animate-fade-in-up" delay={200} className="sm:col-span-2">
                <div className="bg-[#20201f] border-t-[3px] border-[#ffd700] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 mb-1 sm:mb-2">
                    <span className="text-[#ffd700] text-lg sm:text-xl">↗</span>
                    <h3 className="text-lg sm:text-xl font-bold font-['Montserrat'] text-[#e5e2e1]">
                      Media Sosial
                    </h3>
                  </div>
                  {/* Perbaikan jarak antar tombol di mobile dengan gap-2 sm:gap-4 */}
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    {/* Perbaikan tipografi whatapp menjadi WhatsApp */}
                    {["Instagram", "Twitter", "LinkedIn", "WhatsApp"].map((sosial) => (
                      <a
                        key={sosial}
                        href="#"
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#131313] border border-[#999077] text-[#ffd700] text-xs sm:text-sm font-semibold rounded hover:border-[#ffd700] transition-colors"
                      >
                        {sosial}
                      </a>
                    ))}
                  </div>
                </div>
              </RevealItem>
            </div>

            <PetaInteraktif />
          </div>

          {/* KANAN: FORM */}
          <FormUser />

        </div>
      </UserLayout>
    </section>
  );
};

export default KontakPage;