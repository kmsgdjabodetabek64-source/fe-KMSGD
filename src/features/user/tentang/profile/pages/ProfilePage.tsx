import UserLayout from "../../../../../layouts/UserLayout";
import { AUDIO_ITEMS } from "../../services/tentangService";
import RevealItem from "@/components/RevealItem";

const ProfilePage = () => {
  return (
    <UserLayout>
      {/* HERO */}
      <section className="mb-2">
        <RevealItem animation="animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-['Montserrat'] text-[#ffd700] mb-4 leading-tight">
            <span className="text-white">Profil</span> Organisasi
          </h1>
        </RevealItem>
        <RevealItem animation="animate-fade-in-up" delay={150}>
          <p className="text-[#d0c6ab] text-base sm:text-lg leading-relaxed max-w-3xl">
            Mengenal lebih dekat identitas, sejarah, dan arah gerak Keluarga
            Mahasiswa Sunan Gunung Djati di wilayah Jabodetabek.
          </p>
        </RevealItem>
      </section>

      {/* VISI & MISI */}
      <section className="py-12 px-4 mt-8 md:py-20 md:px-6 md:mt-15 max-w-7xl mx-auto border-t border-[#2a2a2a]">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Visi */}
          <RevealItem animation="animate-slide-in-left">
            <div className="bg-[#20201f] border-t-[3px] border-[#ffd700] p-6 md:p-8">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <span className="text-[#ffd700] text-3xl md:text-4xl">👁</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700]">
                  Visi
                </h2>
              </div>
              <p className="text-[#e5e2e1] text-base md:text-lg leading-relaxed">
                Mewujudkan wadah kekeluargaan yang solid, progresif, dan
                berintegritas bagi mahasiswa Sunan Gunung Djati di Jabodetabek,
                serta menjadi inisiator perubahan positif bagi masyarakat.
              </p>
            </div>
          </RevealItem>

          {/* Misi */}
          <RevealItem animation="animate-slide-in-right" delay={60}>
            <div className="bg-[#20201f] border-t-[3px] border-[#ffd700] p-6 md:p-8">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <span className="text-[#ffd700] text-3xl md:text-4xl">🚩</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700]">
                  Misi
                </h2>
              </div>
              <ul className="text-[#e5e2e1] text-sm sm:text-base leading-relaxed space-y-3 md:space-y-4 list-disc list-inside">
                <li>Mempererat tali silaturahmi antar anggota melalui kegiatan rutin dan insidental.</li>
                <li>Mengembangkan potensi akademik dan non-akademik anggota secara berkelanjutan.</li>
                <li>Berperan aktif dalam pengabdian masyarakat di lingkungan Jabodetabek.</li>
                <li>Menjalin sinergi dengan instansi dan organisasi lain yang sejalan.</li>
              </ul>
            </div>
          </RevealItem>
        </div>
      </section>

      {/* JEJAK LANGKAH / TIMELINE */}
      <section className="py-12 px-4 md:py-20 md:px-6 max-w-7xl mx-auto border-t border-[#2a2a2a]">
        {/* Judul Seksi */}
        <RevealItem animation="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700] mb-6 md:mb-10 text-center">
            <span className="text-white">Jejak</span> Langkah
          </h2>
        </RevealItem>

        {/* Blok Deskripsi Narasi */}
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

      {/* HYMNE & MARS */}
      <section className="py-12 px-4 md:py-20 md:px-6 max-w-7xl mx-auto border-t border-[#2a2a2a]">
        <RevealItem animation="animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-['Montserrat'] text-[#ffd700] mb-6 md:mb-8">
            <span className="text-white">Hymne</span> &amp; Mars KMSGD
          </h2>
        </RevealItem>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {AUDIO_ITEMS.map((item, i) => (
            <RevealItem key={item.src} animation="animate-fade-in-up" delay={i * 60}>
              <div className="bg-[#20201f] border border-[#ffd700] p-5 md:p-6 flex flex-col justify-center gap-3 md:gap-4">
                <h3 className="text-lg md:text-xl font-bold font-['Montserrat'] text-[#e5e2e1] mb-2">
                  {item.title}
                </h3>
                <audio controls className="w-full outline-none filter dark:invert dark:hue-rotate-180">
                  <source src={item.src} type="audio/mpeg" />
                  Browser Anda tidak mendukung pemutaran audio.
                </audio>
              </div>
            </RevealItem>
          ))}
        </div>
      </section>
    </UserLayout>
  );
};

export default ProfilePage;