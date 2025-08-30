import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegistracijaForma } from "../../components/auth/RegistracijaForma";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { IAuthAPIService } from "../../api_services/auth/IAuthSevice";

interface RegisterPageProps {
    authApi: IAuthAPIService;
}

export default function RegistracijaStranica({ authApi }: RegisterPageProps) {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user)
            navigate(`/${user.uloga}-dashboard`);
    }, [isAuthenticated, navigate, user]);

    return (
        <main className="app-background">
            <RegistracijaForma authApi={authApi} />
        </main>
    );
}