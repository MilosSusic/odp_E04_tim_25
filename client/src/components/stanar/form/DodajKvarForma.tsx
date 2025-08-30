import { useEffect, useState } from "react";
import type { IFaultService } from "../../../api_services/fault/IFaultService";
import type { Fault } from "../../../models/fault/Fault";

type Props = {
    faultApi: IFaultService;
    token: string;
    userId: number;
    onCreated: (created: Fault) => void;
    onCancel: () => void;
};

const IMAGES_MANIFEST_URL = "/images/_index.json";

export function DodajKvarForma({ faultApi, token, userId, onCreated, onCancel }: Props) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const [imageList, setImageList] = useState<string[]>([]);
    const [imgLoading, setImgLoading] = useState(false);
    const [imgError, setImgError] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!pickerOpen) return;
        setImgError(null);
        setImgLoading(true);
        fetch(IMAGES_MANIFEST_URL)
            .then(r => {
                if (!r.ok) throw new Error("Ne mogu da učitam listu slika.");
                return r.json() as Promise<string[]>;
            })
            .then(list => setImageList(list))
            .catch(err => setImgError(err.message || "Greška pri učitavanju slika."))
            .finally(() => setImgLoading(false));
    }, [pickerOpen]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !description.trim()) {
            setError("Naziv i opis su obavezni.");
            return;
        }

        try {
            setSubmitting(true);
            const created = await faultApi.createFault(token, {
                userId,
                name: name.trim(),
                description: description.trim(),
                imageUrl: imageUrl.trim() || undefined,
            });
            onCreated(created);
        } catch (err: any) {
            setError(err?.message || "Greška pri prijavi kvara.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Prijava novog kvara</h1>
            <form onSubmit={submit}>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Naziv kvara *"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Opis kvara *"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="input-group image-field">
                    <input
                        type="text"
                        placeholder="default.jpg"
                        value={imageUrl}
                        readOnly
                    />
                    <button
                        type="button"
                        className="choose-btn"
                        onClick={() => setPickerOpen(v => !v)}
                        title="Odaberi sliku"
                        aria-label="Odaberi sliku"
                    >
                        …
                    </button>

                    {imageUrl ? <img src={`/images/${imageUrl}`} alt="" /> : null}

                    {pickerOpen && (
                        <div className="image-picker">
                            <div className="hd">
                                <button type="button" onClick={() => setPickerOpen(false)}>Zatvori</button>
                            </div>

                            {imgLoading && <div>Učitavam…</div>}
                            {imgError && <div style={{ color: "crimson" }}>{imgError}</div>}

                            {!imgLoading && !imgError && (
                                <div className="grid">
                                    {imageList.map(file => (
                                        <button
                                            key={file}
                                            type="button"
                                            className={`thumb ${imageUrl === file ? "selected" : ""}`}
                                            onClick={() => { setImageUrl(file); setPickerOpen(false); }}
                                            title={file}
                                        >
                                            <img src={`/images/${file}`} alt={file} />
                                            <span>{file}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {error && <p className="error">{error}</p>}

                <div>
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Slanje…" : "Sačuvaj"}
                    </button>
                    <button type="button" className="btn btn--danger" onClick={onCancel} disabled={submitting}>
                        Otkaži
                    </button>
                </div>
            </form>
        </div>
    );
}
