import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../../hooks/auth/useAuthHook";
import { ObrišiVrednostPoKljuču } from "../../../helpers/local_storage";
import type { IFaultService } from "../../../api_services/fault/IFaultService";
import { faultApi } from "../../../api_services/fault/FaultService";
import type { Fault } from "../../../models/fault/Fault";
import type { FaultStatus } from "../../../models/fault/FaultStatus";
import ZakljuciRadDialog from "../form/ZakljuciRadDialog";

type StatusFilter = FaultStatus | "svi";

type Props = {
  api?: IFaultService;
  token?: string;
};

export default function TabelaKvarova({ api: injectedApi, token: injectedToken }: Props) {
  const api = useMemo(() => injectedApi ?? faultApi, [injectedApi]);
  const { token: authToken, logout } = useAuth();
  const effectiveToken = injectedToken ?? authToken;

  const [kvarovi, setKvarovi] = useState<Fault[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Kreiran");
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [targetStatus, setTargetStatus] = useState<FaultStatus | null>(null);

  const toDate = (v?: string | Date) => {
    if (!v) return 0;
    const d = typeof v === "string" ? new Date(v) : v;
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const load = useCallback(async () => {
    if (!effectiveToken) {
      setError("Nedostaje token za autorizaciju.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let data: Fault[] = [];
      if (statusFilter === "svi") {
        data = await api.getAllFaults(effectiveToken);
      } else {
        try {
          data = await api.getFaultsByStatus(effectiveToken, statusFilter);
        } catch {
          const all = await api.getAllFaults(effectiveToken);
          data = all.filter((f) => f.status === statusFilter);
        }
      }
      data.sort((a, b) => toDate(b.createdAt as any) - toDate(a.createdAt as any));
      setKvarovi(data);
    } catch (e: any) {
      setError(e?.message ?? "Greška pri učitavanju kvarova.");
      setKvarovi([]);
    } finally {
      setLoading(false);
    }
  }, [effectiveToken, statusFilter, api]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const runUpdate = async (id: number, next: FaultStatus) => {
    if (!effectiveToken) return;
    setUpdatingId(id);
    try {
      await api.updateFaultStatus(effectiveToken, id, next);
      setKvarovi((prev) => prev.map((k) => (k.id === id ? { ...k, status: next } : k)));
    } catch (e: any) {
      alert(e?.message ?? "Greška pri promeni statusa.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAccept = (id: number) => {
    if (!confirm("Prihvatiti rad na ovom kvaru?")) return;
    runUpdate(id, "Popravka u toku");
  };

  const handleSaniran = (id: number) => {
    setActiveId(id);
    setTargetStatus("Saniran");
    setDialogOpen(true);
  };

  const handleNijeResen = (id: number) => {
    setActiveId(id);
    setTargetStatus("Problem nije rešen");
    setDialogOpen(true);
  };

  const submitZakljuci = async ({ comment, price }: { comment: string; price: number }) => {
    if (!effectiveToken || !activeId || !targetStatus) return;
    setUpdatingId(activeId);
    try {
      const updated = await api.resolveFault(effectiveToken, activeId, {
        status: targetStatus,
        comment,
        price,
      });
      const updatedPrice = Number((updated as any).price);
      setKvarovi((prev) =>
        prev.map((k) =>
          k.id === activeId
            ? {
                ...k,
                status: targetStatus,
                comment: (updated as any).comment,
                price: Number.isFinite(updatedPrice) ? updatedPrice : (updated as any).price,
              }
            : k
        )
      );
    } catch (e: any) {
      alert(e?.message ?? "Greška pri zaključivanju kvara.");
    } finally {
      setUpdatingId(null);
      setDialogOpen(false);
      setActiveId(null);
      setTargetStatus(null);
    }
  };

  const handleLogout = () => {
    try { ObrišiVrednostPoKljuču("authToken"); } catch { }
    localStorage.removeItem("token");
    localStorage.removeItem("jwt");
    logout();
  };

  const prikazani = useMemo(
    () => (statusFilter === "svi" ? kvarovi : kvarovi.filter((k) => k.status === statusFilter)),
    [kvarovi, statusFilter]
  );

  return (
    <div className="faults">
      <div className="toolbar">
        <h2 className="title">Tabela kvarova</h2>
        <div className="filters">
          <button className="btn btn--danger" onClick={handleLogout}>Odjavi se</button>
          <span className="label" style={{ marginLeft: 12 }}>Status:</span>
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="Kreiran">Kreiran</option>
            <option value="Popravka u toku">Popravka u toku</option>
            <option value="Saniran">Saniran</option>
            <option value="Problem nije rešen">Problem nije rešen</option>
            <option value="svi">Svi</option>
          </select>
        </div>
      </div>

      {loading && <div className="state info">Učitavam…</div>}
      {error && <div className="state error">{error}</div>}

      {!loading && (
        <div className="table-wrap">
          {prikazani.length > 0 ? (
            prikazani.map((k) => (
              <div key={k.id} className="fault-card">
                <div className="fault-row">
                  <span className="field-name">Naziv:</span>
                  <span className="field-value">{k.name}</span>
                </div>
                <div className="fault-row">
                  <span className="field-name">Opis:</span>
                  <span className="field-value">{k.description}</span>
                </div>
                <div className="fault-row">
                  <span className="field-name">Slika:</span>
              <img className="field-value" src={k.imageUrl ?? ""} alt={k.name} />
                </div>
                <div className="fault-row">
                  <span className="field-name">Status:</span>
                  <span className="field-value">{k.status}</span>
                </div>
                <div className="fault-row">
                  <span className="field-name">Kreiran:</span>
                  <span className="field-value">{new Date(k.createdAt).toLocaleString()}</span>
                </div>
                <div className="fault-row">
                  <span className="field-name">Komentar:</span>
                  <span className="field-value">{k.comment}</span>
                </div>
                <div className="fault-row">
                  <span className="field-name">Cena:</span>
                  <span className="field-value">{k.price}</span>
                </div>

                <div className="fault-actions">
                  <button
                    className="btn btn--accept"
                    onClick={() => handleAccept(k.id)}
                    disabled={updatingId === k.id}
                  >
                    Prihvati
                  </button>
                  <button
                    className="btn btn--saniran"
                    onClick={() => handleSaniran(k.id)}
                    disabled={updatingId === k.id}
                  >
                    Saniran
                  </button>
                  <button
                    className="btn btn--not-resolved"
                    onClick={() => handleNijeResen(k.id)}
                    disabled={updatingId === k.id}
                  >
                    Nije rešen
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="state empty">Nema zapisa za izabrani filter.</div>
          )}
        </div>
      )}

      <ZakljuciRadDialog
        open={dialogOpen}
        title={targetStatus === "Saniran" ? "Označi kao saniran" : "Problem nije rešen"}
        onClose={() => { setDialogOpen(false); setActiveId(null); setTargetStatus(null); }}
        onSubmit={submitZakljuci}
      />
    </div>
  );
}