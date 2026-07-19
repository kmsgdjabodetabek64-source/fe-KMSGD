interface PengumumanPentingCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function PengumumanPentingCheckbox({ checked, onChange }: PengumumanPentingCheckboxProps) {
    return (
        <div>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-4 h-4 accent-yellow-600 cursor-pointer"
                />
                <span className="text-sm text-[#ffd700]">Tandai sebagai pengumuman penting</span>
            </label>
        </div>
    );
}