export default function DashboardErrorBanner() {
    return (
        <div className="mb-4 sm:mb-6 border border-[#7a1a1a] bg-[#2a0a0a] px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-[#f09595]">
            Gagal memuat ringkasan dashboard. Periksa koneksi API atau sesi admin.
        </div>
    );
}