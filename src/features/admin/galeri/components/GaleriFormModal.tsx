import type { Galeri, CreateGaleriPayload } from "../galeriType";
import GaleriFormModalContent from "./GaleriFormModalContent";

interface Props {
    open: boolean;
    editing: Galeri | null;
    onClose: () => void;
    onSubmit: (payload: CreateGaleriPayload) => Promise<void>;
}

export default function GaleriFormModal({ open, editing, onClose, onSubmit }: Props) {
    if (!open) return null;

    return (
        <GaleriFormModalContent
            key={editing?.id ?? "create"}
            editing={editing}
            onClose={onClose}
            onSubmit={onSubmit}
        />
    );
}