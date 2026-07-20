import type { Department } from "../../types/tentang.types";
import GroupPhotoCard from "./GroupPhotoCard";

interface Props {
    bk: Department;
}

export default function BKCard({ bk }: Props) {
    const anggota = [bk.ketua, bk.wakil, ...bk.staff];

    return (
        <GroupPhotoCard
            nama={bk.nama}
            desc={bk.desc}
            img={bk.img}
            anggota={anggota}
        />
    );
}