import UserLayout from "../../../../../layouts/UserLayout";
import { HeroSection } from "../components/HeroSection";
import { VisiMisiSection } from "../components/VisiMisiSection";
import { JejakLangkahSection } from "../components/JejakLangkahSection";
import { HymneMarsSection } from "../components/HymneMarsSection";

const ProfilePage = () => {
  return (
    <UserLayout>
      <HeroSection />
      <VisiMisiSection />
      <JejakLangkahSection />
      <HymneMarsSection />
    </UserLayout>
  );
};

export default ProfilePage;