import { TbCircleCheck } from "react-icons/tb";

interface SuccessAlertProps {
    children: React.ReactNode;
}

export default function SuccessAlert({ children }: SuccessAlertProps) {
    return (
        <div className="flex items-start gap-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs px-4 py-3">
            <TbCircleCheck className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{children}</span>
        </div>
    );
}