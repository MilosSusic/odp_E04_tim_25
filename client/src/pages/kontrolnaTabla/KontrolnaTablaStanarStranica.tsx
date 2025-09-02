// src/pages/kontrolna_tabla/KontrolnaTablaStanaraStranica.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PročitajVrednostPoKljuču } from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { KontrolnaTablaStranicaProp } from "../../types/props/kvar/KontrolnaTablaStanarProp";
import { TabelaKvarova } from "../../components/stanar/table/TabelaKvarova";

export default function KontrolnaTablaStanaraStranica({ faultApi }: KontrolnaTablaStranicaProp) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = PročitajVrednostPoKljuču("authToken");
        if (!isAuthenticated || !token) {
            logout();
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, logout, navigate]);

    return (
        <main className="page">
            <section className="dashboard">
                <header className="dashboard__header">
                    <h1 className="dashboard__title">Kontrolna tabla – Stanar</h1>
                    <p className="dashboard__subtitle">Pregled i prijava kvarova</p>
                </header>

                <TabelaKvarova faultApi={faultApi} />
            </section>
        </main>
    );
}
