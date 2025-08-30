// src/pages/kontrolna_tabla/KontrolnaTablaMajstorStranica.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { KontrolnaTablaMajstorProp } from "../../types/props/fault/KontrolnaTablaMajstorStranica";
import TabelaKvarova from "../../components/majstor/table/TabelaKvarova";


export default function KontrolnaTablaMajstorStranica({ faultApi }: KontrolnaTablaMajstorProp) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const token = PročitajVrednostPoKljuču("authToken");

    useEffect(() => {
        if (!isAuthenticated || !token) {
            logout();
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, logout, navigate, token]);

    return (
        <main className="page">
            <section className="dashboard">
                <header className="dashboard__header">
                    <h1 className="dashboard__title">Kontrolna tabla – Majstor</h1>
                    <p className="dashboard__subtitle">Pregled i izmena statusa kvarova</p>
                </header>

                <TabelaKvarova api={faultApi} token={token ?? undefined} />
            </section>
        </main>
    );

}
