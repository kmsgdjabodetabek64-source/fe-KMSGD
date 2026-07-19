interface GaleriFormErrorProps {
    message: string;
}

export default function GaleriFormError({ message }: GaleriFormErrorProps) {
    return (
        <div className="bg-[#2a0a0a] border border-[#7a1a1a] text-[#f09595] py-2 px-3 mb-4 text-sm">
            {message}
        </div>
    );
}