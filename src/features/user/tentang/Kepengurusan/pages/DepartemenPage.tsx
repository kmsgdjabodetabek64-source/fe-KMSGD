import Header from "../../../../../components/Header";
import UserLayout from "../../../../../layouts/UserLayout";
import { CONTENT_HEADER } from "../../TentangData";
import DepartemenList from "../components/DepartemenList";

const DepartemenPage = () => {
  return (
    <UserLayout>
      <Header
        judul={CONTENT_HEADER.departemen.judul}
        judul2={CONTENT_HEADER.departemen.judul2}
        deskripsi={CONTENT_HEADER.departemen.deskripsi}
      />
      <DepartemenList />
    </UserLayout>
  );
};

export default DepartemenPage;
