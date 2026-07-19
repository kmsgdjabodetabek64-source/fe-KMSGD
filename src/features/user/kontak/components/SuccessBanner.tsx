export function SuccessBanner() {
    return (
        <div className="flex items-start gap-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs px-3 sm:px-4 py-3 animate-[fadeIn_0.3s_ease-out]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>
                Pesan berhasil terkirim! Kami akan segera menghubungi Anda melalui email.
            </span>
        </div>
    );
}