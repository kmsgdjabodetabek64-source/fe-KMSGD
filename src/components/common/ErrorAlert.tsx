import { TbAlertTriangle } from "react-icons/tb";

interface ErrorAlertProps {
    message: string;
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
    return (
        <div className="flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs px-3 py-2.5">
            <TbAlertTriangle className="w-4 h-4 shrink-0" />
            {message}
        </div>
    );
}