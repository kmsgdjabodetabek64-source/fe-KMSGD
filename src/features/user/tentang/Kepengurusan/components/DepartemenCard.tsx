import type { Department } from "../../types/tentang.types";
import GroupPhotoCard from "./GroupPhotoCard";

interface Props {
    dept: Department;
}

export default function DepartemenCard({ dept }: Props) {
    const anggota = [dept.ketua, dept.wakil, ...dept.staff];

    return (
        <GroupPhotoCard
            nama={dept.nama}
            desc={dept.desc}
            img={dept.img}
            anggota={anggota}
        />
    );
}