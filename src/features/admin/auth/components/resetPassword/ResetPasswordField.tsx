import { useState } from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";

interface ResetPasswordFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minLength?: number;
    invalid?: boolean;
    errorText?: string;
}

export default function ResetPasswordField({
    label,
    value,
    onChange,
    placeholder,
    minLength,
    invalid,
    errorText,
}: ResetPasswordFieldProps) {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                {label}
            </label>
            <div className="relative flex items-center">
                <input
                    type={show ? "text" : "password"}
                    required
                    minLength={minLength}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full bg-neutral-950 border text-white text-sm pl-3 pr-10 py-2.5 outline-none transition-colors placeholder:text-neutral-600 ${invalid
                        ? "border-red-700 focus:border-red-500"
                        : "border-neutral-700 focus:border-amber-500"
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 text-neutral-400 hover:text-white transition-colors focus:outline-none"
                >
                    {show ? <TbEyeOff className="w-5 h-5" /> : <TbEye className="w-5 h-5" />}
                </button>
            </div>
            {invalid && errorText && (
                <p className="text-[10px] text-red-400 mt-0.5">{errorText}</p>
            )}
        </div>
    );
}