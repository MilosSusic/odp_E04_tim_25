
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthValidator";
import { validacijaPodatakaAuth } from "../../api_services/validators/auth/AuthValidator";

export function RegistracijaForma({ authApi }: AuthFormProps) {
  const [imePrezime, setImePrezime] = useState("");
  const [korisnickoIme, setKorisnickoIme] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [uloga, setUloga] = useState("stanar");
  const [greska, setGreska] = useState("");
  const navigate = useNavigate();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imePrezime.trim()) {
      setGreska("Ime i prezime su obavezni.");
      return;
    }

    const validacija = validacijaPodatakaAuth(korisnickoIme, lozinka);
    if (!validacija.uspesno) {
      setGreska(validacija.poruka ?? "Neispravni podaci");
      return;
    }

    const odgovor = await authApi.registracija(imePrezime, korisnickoIme, lozinka, uloga);
    if (odgovor.success && odgovor.data) {
      navigate("/login", { state: { korisnickoIme, lozinka } });
    } else {
      setGreska(odgovor.message);
      setImePrezime("");
      setKorisnickoIme("");
      setLozinka("");
    }
  };

  return (
    <div className="form-container">
      <h1>Registracija</h1>
      <form onSubmit={podnesiFormu}>
        <div className="input-group">
          <label htmlFor="imePrezime">Ime i prezime</label>
          <input
            id="imePrezime"
            type="text"
            value={imePrezime}
            onChange={(e) => setImePrezime(e.target.value)}
          />
        </div>

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

        <div className="input-group">
          <label htmlFor="uloga">Uloga</label>
          <select
            id="uloga"
            value={uloga}
            onChange={(e) => setUloga(e.target.value)}
          >
            <option value="stanar">Stanar</option>
            <option value="majstor">Majstor</option>
          </select>
        </div>

        {greska && <p className="error">{greska}</p>}

        <button type="submit">Registruj se</button>
      </form>

      <p className="form-footer">
        Već imate nalog?{" "}
        <Link to="/login">Prijavite se</Link>
      </p>
    </div>
  );
}
