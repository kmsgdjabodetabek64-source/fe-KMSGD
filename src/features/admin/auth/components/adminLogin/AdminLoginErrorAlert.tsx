interface AdminLoginErrorAlertProps {
    message: string;
}

export default function AdminLoginErrorAlert({ message }: AdminLoginErrorAlertProps) {
    return (
        <div className="flex items-center gap-2 bg-red-950 border border-red-800 text-red-300 text-xs px-3 py-2.5 mb-4">
            <i className="ti ti-alert-circle text-sm" />
            {message}
        </div>
    );
}