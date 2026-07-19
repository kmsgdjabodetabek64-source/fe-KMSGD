export default function DashboardHeader() {
    return (
        <div className="mb-6 sm:mb-8 flex flex-col gap-1 sm:gap-2">
            <h1 className="text-[#FACC15] text-xl sm:text-3xl font-bold tracking-wide">
                Dashboard Admin
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm">
                Ringkasan data konten dan perkembangan kepengurusan KMSGD.
            </p>
        </div>
    );
}