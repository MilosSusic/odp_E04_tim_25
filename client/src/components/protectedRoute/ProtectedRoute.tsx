import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ObrišiVrednostPoKljuču } from "../../helpers/local_storage";
import { useAuth } from "../../hooks/auth/useAuthHook";

type ProtectedRouteProps = {
    children: React.ReactNode;
    requiredRole: string;
    redirectTo?: string;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    redirectTo = "/login",
}) => {

    const { isAuthenticated, user, isLoading, logout } = useAuth();
    const location = useLocation();
    console.log("auth:", { isAuthenticated, user });
    const handleLogout = () => {
        ObrišiVrednostPoKljuču("authToken");
        logout();
    };

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (requiredRole && user?.uloga !== requiredRole) {
        return (
            <main className="unauthorized-page">
                <div className="unauthorized-container">
                    <h2 className="unauthorized-title">Nemate dozvolu</h2>
                    <p className="unauthorized-text">
                        Potrebna je uloga <span className="unauthorized-role">"{requiredRole}"</span> za pristup ovoj stranici.
                    </p>
                    <button onClick={handleLogout} className="unauthorized-button">
                        Odjava iz aplikacije
                    </button>
                </div>
            </main>

        );
    }
    return <>{children}</>;
};
