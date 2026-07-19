interface SubmitButtonProps {
    loading: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export function SubmitButton({ loading, onClick }: SubmitButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="mt-2 sm:mt-4 bg-[#ffd700] text-[#131313] font-bold text-base sm:text-lg py-3 sm:py-4 px-5 sm:px-6 flex items-center justify-center gap-2 outline-none transition-all duration-300 ease-out hover:bg-[#e9c400] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#e5e2e1] active:translate-y-0 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
            {loading ? (
                <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Mengirim...
                </>
            ) : (
                <>
                    Kirim Pesan <span className="transition-transform duration-300 group-hover:translate-x-1">➤</span>
                </>
            )}
        </button>
    );
}