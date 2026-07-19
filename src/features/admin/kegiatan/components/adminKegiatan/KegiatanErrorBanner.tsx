interface KegiatanErrorBannerProps {
    message: string;
}

export default function KegiatanErrorBanner({ message }: KegiatanErrorBannerProps) {
    return (
        <div className="bg-[#2a0a0a] border border-[#7a1a1a] text-[#f09595] py-2.5 px-4 mb-4 text-sm">
            {message}
        </div>
    );
}