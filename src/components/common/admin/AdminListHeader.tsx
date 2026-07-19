interface AdminListHeaderProps {
    title: string;
    subtitle: string;
}

export default function AdminListHeader({ title, subtitle }: AdminListHeaderProps) {
    return (
        <div className="mb-8 border-b border-[#b8982a] pb-4">
            <h1 className="text-[1.75rem] font-bold text-[#ffd700] m-0">{title}</h1>
            <p className="text-[#a89040] mt-1 m-0 text-[0.9rem]">{subtitle}</p>
        </div>
    );
}