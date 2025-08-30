
// src/components/stanar/table/TabelaKvarova.tsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../hooks/auth/useAuthHook";
import { ObrišiVrednostPoKljuču } from "../../../helpers/local_storage";
import type { IFaultService } from "../../../api_services/fault/IFaultService";
import type { Fault } from "../../../models/fault/Fault";
import type { FaultStatus } from "../../../models/fault/FaultStatus";
import { DodajKvarForma } from "../form/DodajKvarForma";

interface TabelaKvarovaProps {
    faultApi: IFaultService;
}
type StatusFilter = FaultStatus | "svi";
type SortKey = "opadajuce-datum" | "rastuce-datum" | "opadajuce-cijena" | "rastuce-cijena";

export function TabelaKvarova({ faultApi }: TabelaKvarovaProps) {
    const { token, user, logout } = useAuth();
    const [kvarovi, setKvarovi] = useState<Fault[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("svi");
    const [sortKey, setSortKey] = useState<SortKey>("opadajuce-datum");
    const [showForm, setShowForm] = useState(false);

    const handleLogout = () => {
        ObrišiVrednostPoKljuču("authToken");
        logout();
    };

    const loadMyFaults = async () => {
        if (!token || !user?.id) return;
        setLoading(true);
        try {
            const data = await faultApi.getMyFaults(token, user.id);
            setKvarovi(data);
        } catch (e) {
            console.error("Greška pri učitavanju kvarova:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyFaults();
    }, [token, user?.id, faultApi]);

    const onLike = (id: number) => {
        console.log("Like kliknut za kvar ID:", id);
    };

    const toDate = (v?: string | Date) => {
        if (!v) return 0;
        const d = typeof v === "string" ? new Date(v) : v;
        return isNaN(d.getTime()) ? 0 : d.getTime();
    };

    const toPrice = (v?: number | null) => (typeof v === "number" ? v : -Infinity);

    const prikazani = useMemo(() => {
        const filtered =
            statusFilter === "svi"
                ? kvarovi
                : kvarovi.filter((k) => k.status === statusFilter);

        const sorted = [...filtered].sort((a, b) => {
            switch (sortKey) {
                case "opadajuce-datum":
                    return toDate(b.createdAt) - toDate(a.createdAt);
                case "rastuce-datum":
                    return toDate(a.createdAt) - toDate(b.createdAt);
                case "opadajuce-cijena":
                    return toPrice(b.price) - toPrice(a.price);
                case "rastuce-cijena":
                    return toPrice(a.price) - toPrice(b.price);
                default:
                    return 0;
            }
        });
        return sorted;
    }, [kvarovi, statusFilter, sortKey]);

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);

    const handleCreated = async (_created: Fault) => {
        await loadMyFaults();
        setShowForm(false);
    };

    return (
        <div className="faults">
            {showForm && token && user?.id && (
                <DodajKvarForma
                    faultApi={faultApi}
                    token={token}
                    userId={user.id}
                    onCreated={handleCreated}
                    onCancel={closeForm}
                />
            )}

            <div className="toolbar">
                <h2 className="title">Moji kvarovi</h2>

                <div className="filters">
                    <span className="label">Status:</span>
                    <select
                        className="select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    >
                        <option value="svi">Svi</option>
                        <option value="Kreiran">Kreiran</option>
                        <option value="Popravka u toku">Popravka u toku</option>
                        <option value="Saniran">Saniran</option>
                        <option value="Problem nije rešen">Problem nije rešen</option>
                    </select>

                    <span className="label" style={{ marginLeft: 12 }}>Sortiraj po:</span>
                    <select
                        className="select"
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value as SortKey)}
                    >
                        <option value="opadajuce-datum">Datumu (opadajuce datum)</option>
                        <option value="rastuce-datum">Datumu (rastuce datum)</option>
                        <option value="opadajuce-cijena">Ceni (opadajuce cijena)</option>
                        <option value="rastuce-cijena">Ceni (rastuce cijena)</option>
                    </select>

                    <button className="btn btn--primary" onClick={openForm} style={{ marginLeft: 12 }}>
                        + Prijavi kvar
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="state info">Učitavam…</div>
            ) : (
                <div className="faults-list">
                    {prikazani.length > 0 ? (
                        prikazani.map((k) => (
                            <div key={k.id} className="fault-card">
                                <div className="row">
                                    <strong>Naziv:</strong>
                                    <span>{k.name}</span>
                                </div>
                                <div className="row">
                                    <strong>Opis:</strong>
                                    <span>{k.description}</span>
                                </div>
                                <div className="row">
                                    <strong>Status:</strong>
                                    <span>{k.status}</span>
                                </div>
                                <div className="row">
                                    <strong>Datum prijave:</strong>
                                    <span>{k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "-"}</span>
                                </div>
                                <div className="row">
                                    <strong>Cena:</strong>
                                    <span>{k.price ?? "-"}</span>
                                </div>
                                <div className="row">
                                    <strong>Komentar:</strong>
                                    <span>{k.comment ?? "-"}</span>
                                </div>

                                {k.imageUrl && (
                                    <div className="row image">
                                        <strong>Slika:</strong>
                                        <img
                                            src={k.imageUrl}
                                            alt={k.name}
                                            style={{ maxWidth: "200px", marginTop: "8px", borderRadius: "6px" }}
                                        />
                                    </div>
                                )}

                                <div className="actions" style={{ marginTop: "8px" }}>
                                    <button onClick={() => onLike(k.id)} className="btn btn--secondary">
                                        👍 Sviđa mi se
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="state empty">Nema kvarova za prikaz.</div>
                    )}
                </div>
            )}

            <div className="actions" style={{ marginTop: "16px" }}>
                <button onClick={handleLogout} className="btn btn--danger">
                    Odjavi se
                </button>
            </div>
        </div>
    );
}