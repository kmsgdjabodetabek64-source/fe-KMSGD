export type MemberVariant = "ketua" | "anggota" | "demisioner";

export interface Member {
    nama: string;
    jabatan: string;
    image?: string | null;
}

export interface Department {
    nama: string;
    desc: string;
    img?: string | null;
    ketua: Member;
    wakil: Member;
    staff: Member[];
}
