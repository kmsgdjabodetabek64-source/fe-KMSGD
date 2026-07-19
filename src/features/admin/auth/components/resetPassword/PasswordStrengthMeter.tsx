interface PasswordStrengthMeterProps {
    password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    if (!password) return null;

    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];

    return (
        <div className="flex gap-1">
            {checks.map((met, i) => (
                <div
                    key={i}
                    className={`h-1 flex-1 transition-colors ${met ? "bg-amber-500" : "bg-neutral-700"}`}
                />
            ))}
        </div>
    );
}