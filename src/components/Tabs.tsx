type TabItem<T extends string> = {
    key: T;
    label: string;
    icon?: React.ReactNode;
};

type TabsProps<T extends string> = {
    tabs: TabItem<T>[];
    activeTab: T;
    onChange: (key: T) => void;
};

const Tabs = <T extends string>({ tabs, activeTab, onChange }: TabsProps<T>) => {
    return (
        <div className="flex gap-1 border-b border-[#2a2a2a] mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`flex items-center gap-2 px-6 py-3 font-bold text-sm tracking-wider transition-colors cursor-pointer ${activeTab === tab.key
                        ? "bg-[#1a1500] border-b-2 border-[#b8982a] text-[#ffd700]"
                        : "bg-transparent border-b-2 border-transparent text-zinc-500 hover:text-[#b8982a]"
                        }`}
                >
                    {tab.icon && <span>{tab.icon}</span>}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
export type { TabItem, TabsProps };