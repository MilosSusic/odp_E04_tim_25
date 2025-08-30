// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <main className="page-404" role="main" aria-labelledby="nf-title">
            <section className="page-404__card">
                <div className="page-404__art" aria-hidden="true">
                    <span className="page-404__code">404</span>
                </div>

                <h1 id="nf-title" className="page-404__title">Stranica nije pronađena</h1>
                <p className="page-404__desc">
                    Izgleda da tražena adresa ne postoji ili je premeštena.
                </p>

                <div className="page-404__actions">
                    <Link to="/" className="btn btn--primary">Početna</Link>
                    <a href="mailto:support@example.com" className="btn">Prijavi problem</a>
                </div>
            </section>
        </main>
    );
}
