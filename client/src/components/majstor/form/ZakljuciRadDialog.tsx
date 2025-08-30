import { useState } from "react";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onSubmit: (payload: { comment: string; price: number }) => Promise<void> | void;
};

export default function ZakljuciRadDialog({ open, title, onClose, onSubmit }: Props) {
  const [comment, setComment] = useState("");
  const [price, setPrice] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const priceNum = Number(price);
    if (!comment.trim()) { setErr("Komentar je obavezan."); return; }
    if (!Number.isFinite(priceNum) || priceNum < 0) { setErr("Cena mora biti broj ≥ 0."); return; }
    if (comment.length > 120) { setErr("Komentar može imati najviše 120 karaktera."); return; }

    try {
      setSubmitting(true);
      await onSubmit({ comment: comment.trim(), price: Number(priceNum.toFixed(2)) });
      onClose();
      setComment("");
      setPrice("");
    } catch (e: any) {
      setErr(e?.message ?? "Došlo je do greške.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__content card">
        <header className="modal__header">
          <h3 className="modal__title">{title ?? "Zaključi rad"}</h3>
          <button className="icon-btn" aria-label="Zatvori" onClick={onClose}>✕</button>
        </header>

        {err && <div className="alert alert--error">{err}</div>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field field--full">
            <label className="label" htmlFor="comment">Komentar</label>
            <textarea
              id="comment"
              className="input input--area"
              value={comment}
              maxLength={120}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Kratak opis radova / ishoda…"
              required
            />
            <div className="hint">{comment.length}/120</div>
          </div>

          <div className="field">
            <label className="label" htmlFor="price">Cena (RSD)</label>
            <input
              id="price"
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="npr. 3500"
              inputMode="decimal"
              required
            />
          </div>

          <div className="modal__actions field field--full">
            <button type="button" className="btn" onClick={onClose} disabled={submitting}>Otkaži</button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? "Čuvam…" : "Sačuvaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
