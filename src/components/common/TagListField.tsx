import { useState } from "react";

interface TagListFieldProps {
    label: string;
    placeholder: string;
    items: string[];
    onChange: (items: string[]) => void;
}

export default function TagListField({ label, placeholder, items, onChange }: TagListFieldProps) {
    const [input, setInput] = useState("");

    const addItem = () => {
        const val = input.trim();
        if (!val) return;
        onChange([...items, val]);
        setInput("");
    };

    const removeItem = (index: number) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">{label}</label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addItem();
                        }
                    }}
                    placeholder={placeholder}
                    className="flex-1 bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
                <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 text-sm border border-yellow-700 text-[#ffd700] hover:bg-yellow-700 hover:text-black transition-colors cursor-pointer"
                >
                    Tambah
                </button>
            </div>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                        <span
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1 text-xs bg-neutral-900 border border-neutral-700 text-[#ffd700]"
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => removeItem(i)}
                                className="text-red-400 hover:text-red-300 cursor-pointer"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}