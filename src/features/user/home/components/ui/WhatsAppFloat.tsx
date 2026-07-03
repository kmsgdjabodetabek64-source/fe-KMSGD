export default function WhatsAppFloat() {
    return (
        <a
            href="https://wa.me/6281234567890?text=Halo%20KMSGD%2C%20saya%20ingin%20bertanya..."
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group"
            aria-label="Chat via WhatsApp"
        >
            <span className="text-2xl">💬</span>

            <span className="absolute right-16 bg-[#1A1A1A] text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat Kami!
            </span>
        </a>
    );
}