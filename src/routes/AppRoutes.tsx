import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from "../features/user/home/pages/HomePage";
import RootLayout from "../layouts/RootLayout";
import ProfilePage from "../features/user/tentang/profile/pages/ProfilePage";
import StrukturPage from "../features/user/tentang/Kepengurusan/pages/StrukturPage";
import DepartemenPage from "../features/user/tentang/Kepengurusan/pages/DepartemenPage";
import BKPage from "../features/user/tentang/Kepengurusan/pages/BKPage";
import DemisonerPage from "../features/user/tentang/Kepengurusan/pages/DemisonerPage";
import KegiatanPage from "../features/user/kegiatan/pages/KegiatanPage";
import PengumumanPage from "../features/user/pengumuman/pages/PengumumanPage";
import GaleriPage from "../features/user/galeri/pages/GaleriPage";
import KontakPage from "../features/user/kontak/pages/KontakPage";
import NotFoundPage from "../pages/NotFoundPage";
import DetailKegiatan from "../features/user/kegiatan/pages/DetailKegiatan";
import Detailpengumuman from "../features/user/pengumuman/pages/DetailPengumuman";
import AdminLoginPage from "../features/admin/auth/pages/AdminLoginPage";
import ForgotPasswordPage from "../features/admin/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/admin/auth/pages/ResetPasswordPage";
import AdminLayout from "../layouts/AdminLayout";
import DashboardAdmin from "../features/admin/dashboard/pages/DashboardAdmin";
import AdminKegiatan from "../features/admin/kegiatan/page/AdminKegiatan";
import Kepengurusan from "../features/admin/kepengurusan/Kepengurusan";
import KegiatanForm from "../features/admin/kegiatan/page/KegiatanForm";
import PeriodePage from "../features/admin/kepengurusan/priode/PeriodePage";
import DepartemenAdminPage from "../features/admin/kepengurusan/departemen/DepartemenPage";
import BKAdminPage from "../features/admin/kepengurusan/bk/BKPage";
import PengurusPage from "../features/admin/kepengurusan/pengurus/PengurusPage";
import KegiatanEditForm from "../features/admin/kegiatan/page/KegiatanEditForm";
import AdminPengumuman from "../features/admin/pengumuman/page/AdminPengumuman";
import ProtectedRoute from "../components/ProtectedRoute";
import GuestRoute from "../components/GuestRoute";
import PengumumanForm from "@/features/admin/pengumuman/page/pengumumanForm";
import AdminGaleri from "@/features/admin/galeri/page/AdminGaleri";
import AdminHomeBackground from "@/features/admin/homeBackground/AdminHomeBackground";

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/profil', element: <ProfilePage /> },
            { path: '/kepengurusan/struktur', element: <StrukturPage /> },
            { path: '/kepengurusan/departemen', element: <DepartemenPage /> },
            { path: '/kepengurusan/badan-khusus', element: <BKPage /> },
            { path: '/kepengurusan/demisoner', element: <DemisonerPage /> },
            { path: '/kegiatan', element: <KegiatanPage /> },
            { path: '/kegiatan/detail', element: <DetailKegiatan /> },
            { path: '/kegiatan/detail/:id', element: <DetailKegiatan /> },
            { path: '/pengumuman', element: <PengumumanPage /> },
            { path: '/pengumuman/detail', element: <Detailpengumuman /> },
            { path: '/pengumuman/detail/:id', element: <Detailpengumuman /> },
            { path: '/galeri', element: <GaleriPage /> },
            { path: '/kontak', element: <KontakPage /> },
            { path: '*', element: <NotFoundPage /> }
        ]
    },
    {
        element: <GuestRoute />,
        children: [
            { path: '/portal-kmsgd/auth', element: <AdminLoginPage /> },
        ]
    },
    {
        // Forgot & reset password — publik, tidak butuh secret token maupun auth
        path: '/portal-kmsgd/forgot-password',
        element: <ForgotPasswordPage />,
    },
    {
        path: '/portal-kmsgd/reset-password',
        element: <ResetPasswordPage />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/admin',
                element: <AdminLayout />,
                children: [
                    { index: true, element: <DashboardAdmin /> },
                    { path: 'dashboard', element: <DashboardAdmin /> },
                    { path: 'kegiatan', element: <AdminKegiatan /> },
                    { path: 'kegiatan/tambah', element: <KegiatanForm /> },
                    { path: 'kegiatan/edit/:id', element: <KegiatanEditForm /> },
                    {
                        path: 'kepengurusan',
                        element: <Kepengurusan />,
                        children: [
                            { index: true, element: <Navigate to="periode" replace /> },
                            { path: 'periode', element: <PeriodePage /> },
                            { path: 'departemen', element: <DepartemenAdminPage /> },
                            { path: 'bk', element: <BKAdminPage /> },
                            { path: 'pengurus', element: <PengurusPage /> }
                        ]
                    },
                    { path: 'pengumuman', element: <AdminPengumuman /> },
                    { path: 'pengumuman/tambah', element: <PengumumanForm /> },
                    { path: 'pengumuman/edit/:id', element: <PengumumanForm /> },
                    { path: 'galeri', element: <AdminGaleri /> },
                    { path: 'home-background', element: <AdminHomeBackground /> }
                ]
            }
        ]
    }
]);
