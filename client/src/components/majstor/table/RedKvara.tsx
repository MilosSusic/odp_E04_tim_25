import type { Fault } from "../../../models/kvar/Kvar";
import type { FaultStatus } from "../../../models/kvar/KvarStatus";

type Props = {
  kvar: Fault;
  updating?: boolean;
  onAccept: (id: number) => void;
  onSaniran: (id: number) => void;
  onNijeResen: (id: number) => void;
};

const STATUS_CLASS: Record<FaultStatus, string> = {
  "Kreiran": "kreiran",
  "Popravka u toku": "u-toku",
  "Saniran": "saniran",
  "Problem nije rešen": "problem",
};

function formatDate(v?: string | Date) {
  if (!v) return "—";
  const d = typeof v === "string" ? new Date(v) : v;
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("sr-RS");
}

function formatPrice(v: unknown) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? `${n.toFixed(2)} RSD` : "—";
}

export function RedUTabeliKvaraMajstor({
  kvar,
  updating,
  onAccept,
  onSaniran,
  onNijeResen,
}: Props) {
  const badgeCls = `badge badge--${STATUS_CLASS[kvar.status as FaultStatus]}`;

  return (
    <tr>
      <td>{kvar.name}</td>
      <td className="col-desc">{kvar.description}</td>
      <td className="col-img">
        <img
          src={`/images/${kvar.imageUrl || "default.jpg"}`}
          alt=""
          width={40}
          height={40}
          style={{ objectFit: "cover", borderRadius: 6, display: "block" }}
        />
      </td>
      <td><span className={badgeCls}>{kvar.status}</span></td>
      <td>{formatDate(kvar.createdAt as any)}</td>
      <td>{(kvar as any).comment ?? "—"}</td>

      <td>{formatPrice((kvar as any).price)}</td>

      <td>
        <div className="actions">
          {kvar.status === "Kreiran" && (
            <button
              className="btn btn--primary"
              onClick={() => onAccept(kvar.id)}
              disabled={!!updating}
              title="Prihvati / započni rad"
            >
              {updating ? "..." : "Prihvati"}
            </button>
          )}

          {kvar.status === "Popravka u toku" && (
            <>
              <button
                className="btn btn--success"
                onClick={() => onSaniran(kvar.id)}
                disabled={!!updating}
                title="Označi kao saniran"
              >
                {updating ? "..." : "Saniran"}
              </button>
              <button
                className="btn btn--danger"
                onClick={() => onNijeResen(kvar.id)}
                disabled={!!updating}
                title="Problem nije rešen"
              >
                {updating ? "..." : "Problem nije rešen"}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
