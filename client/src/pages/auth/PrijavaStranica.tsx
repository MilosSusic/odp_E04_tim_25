import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PrijavaForma } from "../../components/auth/PrijavaForma";
import { useAuth } from "../../hooks/auth/useAuthHook";
import type { IAuthAPIService } from "../../api_services/auth/IAuthSevice";

interface LoginPageProps {
  authApi: IAuthAPIService;
}

export default function PrijavaStranica({ authApi }: LoginPageProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !user?.uloga) return;

    const target = `/${user.uloga}-dashboard`;
    if (location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user?.uloga, location.pathname, navigate]);

  if (isAuthenticated && user?.uloga) return null;

  return (
    <main className="app-background">
      <PrijavaForma authApi={authApi} />
    </main>
  );
}
