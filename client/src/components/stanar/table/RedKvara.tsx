import type { Fault } from "../../../models/fault/Fault";
import type { FaultStatus } from "../../../models/fault/FaultStatus";

interface RedUTabeliKvaraProps {
    kvar: Fault;
    onLike: (id: number) => void;
}

function formatDate(v?: string | Date) {
    if (!v) return "—";
    const d = typeof v === "string" ? new Date(v) : v;
    return isNaN(d.getTime()) ? "—" : d.toLocaleString("sr-RS");
}

const STATUS_CLASS: Record<FaultStatus, string> = {
    "Kreiran": "kreiran",
    "Popravka u toku": "u-toku",
    "Saniran": "saniran",
    "Problem nije rešen": "problem",
};


export function RedUTabeliKvara({ kvar, onLike }: RedUTabeliKvaraProps) {
    const hasComment = Boolean(kvar.comment);
    const badgeCls = `badge badge--${STATUS_CLASS[kvar.status as FaultStatus]}`;
    return (
        <tr>
            <td>{kvar.name}</td>
            <td className="col-desc">{kvar.description}</td>
            <td>
                <span className={badgeCls}>{kvar.status}</span>
            </td>
            <td className="col-img">
                <img
                    src={`/images/${kvar.imageUrl || "default.jpg"}`}
                    alt=""
                    width={40}
                    height={40}
                    style={{ objectFit: "cover", borderRadius: 6, display: "block" }}
                />
            </td>
            <td>{formatDate(kvar.createdAt)}</td>
            <td>
                {typeof kvar.price === "number"
                    ? Intl.NumberFormat("sr-RS", { style: "currency", currency: "RSD", maximumFractionDigits: 0 }).format(kvar.price)
                    : "—"}
            </td>
            <td className="col-desc">{kvar.comment ?? "—"}</td>
            <td>
                <div className="actions">
                    <button
                        className="btn btn--primary"
                        onClick={() => onLike(kvar.id)}
                        disabled={!hasComment}
                        title={hasComment ? "Sviđa mi se komentar" : "Nema komentara"}
                    >
                        Like
                    </button>
                </div>
            </td>
        </tr>
    );
}
