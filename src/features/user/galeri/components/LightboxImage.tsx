import type { GaleriItem } from "../services/galeriService";

interface LightboxImageProps {
    photo: GaleriItem;
    index: number;
    total: number;
}

export const LightboxImage = ({ photo, index, total }: LightboxImageProps) => {
    return (
        <figure className="w-full max-w-5xl max-h-[82vh] sm:max-h-[86vh] flex flex-col items-center gap-3">
            <img
                src={photo.url}
                alt={photo.judul || "Preview foto galeri"}
                className="max-w-full max-h-[65vh] sm:max-h-[80vh] object-contain border-2 border-[#ffd700] bg-[#0f0f0f]"
                decoding="async"
            />

            <figcaption className="max-w-full text-center text-sm text-[#d0c6ab] px-4 sm:px-12">
                {photo.judul || `Foto ${index + 1} dari ${total}`}
            </figcaption>
        </figure>
    );
};