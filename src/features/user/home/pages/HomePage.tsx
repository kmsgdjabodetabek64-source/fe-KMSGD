import { Helmet } from "react-helmet-async";
import HeroSection from "../components/sections/HeroSection";
import StatsSection from "../components/sections/StatsSection";
import KetuaSection from "../components/sections/KetuaSection";
import FokusKegiatanSection from "../components/sections/FokusKegiatanSection";
import DewanPendiriSection from "../components/sections/DewanPendiriSection";
import GallerySection from "../components/sections/GallerySection";
import PengumumanSection from "../components/sections/PengumumanSection";
import CTASection from "../components/sections/CTASection";
import WhatsAppFloat from "../components/ui/WhatsAppFloat";
import UserLayout from "@/layouts/UserLayout";

export default function HomePage() {
    return (
        <UserLayout isHome>
            <Helmet>
                <title>KMSGD Jabodetabek | Keluarga Mahasiswa Sunan Gunung Djati</title>
                <meta
                    name="description"
                    content="Wadah silaturahmi, kolaborasi, dan pengembangan diri bagi mahasiswa Sunan Gunung Djati di kawasan metropolitan Jabodetabek."
                />
            </Helmet>

            <HeroSection />
            <StatsSection />
            <KetuaSection />
            <DewanPendiriSection />
            <FokusKegiatanSection />
            <GallerySection />
            <PengumumanSection />
            <CTASection />
            <WhatsAppFloat />
        </UserLayout>
    );
}