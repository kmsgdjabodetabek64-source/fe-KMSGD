interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    value: string;
    disabled: boolean;
    multiline?: boolean;
    rows?: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const sharedFieldClass =
    "bg-[#131313] border border-[#e5e2e1] text-[#e5e2e1] text-sm p-2.5 sm:p-3 outline-none placeholder:text-[#4d4732] transition-all duration-300 ease-out hover:border-[#d0c6ab] focus:border-[#ffd700] focus:-translate-y-1 focus:shadow-[4px_4px_0_0_#ffd700] disabled:opacity-50 disabled:cursor-not-allowed";

export function FormField({
    label,
    name,
    type = "text",
    placeholder,
    value,
    disabled,
    multiline = false,
    rows = 5,
    onChange,
}: FormFieldProps) {
    return (
        <div className="flex flex-col gap-2 group">
            <label className="text-[#d0c6ab] text-xs font-semibold tracking-wide transition-colors group-focus-within:text-[#ffd700]">
                {label}
            </label>
            {multiline ? (
                <textarea
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    rows={rows}
                    className={`${sharedFieldClass} resize-none`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={sharedFieldClass}
                />
            )}
        </div>
    );
}