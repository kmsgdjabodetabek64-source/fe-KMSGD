import Header from "../../../../../components/Header";
import UserLayout from "../../../../../layouts/UserLayout";
import { CONTENT_HEADER } from "../../TentangData";
import StrukturOrganisasi from "../components/StrukturOrganisasiList";

const StrukturPage = () => {
  return (
    <UserLayout>
      <Header
        judul={CONTENT_HEADER.struktur.judul}
        judul2={CONTENT_HEADER.struktur.judul2}
        deskripsi={CONTENT_HEADER.struktur.deskripsi}
      />

      <StrukturOrganisasi />
    </UserLayout>
  );
};

export default StrukturPage;
