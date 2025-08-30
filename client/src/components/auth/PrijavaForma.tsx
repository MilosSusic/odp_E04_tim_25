import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthValidator";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";
import { jwtDecode } from "jwt-decode";

export function PrijavaForma({ authApi }: AuthFormProps) {
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  interface LocationState {
    korisnickoIme?: string;
    lozinka?: string;
  }

  const location = useLocation();
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.korisnickoIme) setKorisnickoIme(state.korisnickoIme);
    if (state?.lozinka) setLozinka(state.lozinka);
  }, [location.state]);

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Neispravni podaci");
      return;
    }

    const odgovor = await authApi.prijava(korisnickoIme, lozinka);
    if (odgovor.success && odgovor.data) {
      const token = odgovor.data as string;

      let claims: JwtTokenClaims | null = null;
      try {
        claims = jwtDecode<JwtTokenClaims>(token);
      } catch {
        setGreska("Neispravan token sa servera.");
        return;
      }
      if (!claims?.uloga) {
        setGreska("Nedostaje uloga u tokenu.");
        return;
      }
      login(token);
      navigate(`/${claims.uloga}-dashboard`, { replace: true });
    } else {
      setGreska(odgovor.message);
      setKorisnickoIme("");
      setLozinka("");
    }
  };

  return (
    <div className="form-container">
      <h1>Prijava</h1>
      <form onSubmit={podnesiFormu}>
        <div className="input-group">
          <label htmlFor="korisnickoIme">Korisničko ime</label>
          <input
            id="korisnickoIme"
            type="text"
            value={korisnickoIme}
            onChange={(e) => setKorisnickoIme(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="lozinka">Lozinka</label>
          <input
            id="lozinka"
            type="password"
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
          />
        </div>
        {greska && <p className="error">{greska}</p>}
        <button type="submit">Prijavi se</button>
      </form>
      <p className="form-footer">
        Nemate nalog? <Link to="/register">Registruj se</Link>
      </p>
    </div>
  );
}