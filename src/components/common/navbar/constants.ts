import type { NavItem } from "./types";

export const MENU_ITEMS: NavItem[] = [
  { label: "Beranda", path: "/" },
  {
    label: "Tentang",
    subItems: [
      { label: "Profil", path: "/profil" },
      { label: "Struktur Organisasi", path: "/kepengurusan/struktur" },
      { label: "Departemen", path: "/kepengurusan/departemen" },
      { label: "Badan Khusus", path: "/kepengurusan/badan-khusus" },
      { label: "Demisoner", path: "/kepengurusan/demisoner" },
    ],
  },
  { label: "Kegiatan", path: "/kegiatan" },
  { label: "Pengumuman", path: "/pengumuman" },
  { label: "Galeri", path: "/galeri" },
  { label: "Kontak", path: "/kontak" },
];
