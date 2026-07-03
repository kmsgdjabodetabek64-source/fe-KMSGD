import Header from "../../../../../components/Header";
import UserLayout from "../../../../../layouts/UserLayout";
import { CONTENT_HEADER } from "../../TentangData";
import BKList from "../components/BKList";

const BKPage = () => {
  return (
    <UserLayout>
      <Header
        judul={CONTENT_HEADER.bk.judul}
        judul2={CONTENT_HEADER.bk.judul2}
        deskripsi={CONTENT_HEADER.bk.deskripsi}
      />
      <BKList />
    </UserLayout>
  );
};

export default BKPage;
