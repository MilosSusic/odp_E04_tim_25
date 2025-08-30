import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface IAuthAPIService {
  prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse>;
  registracija(imePrezime: string, korisnickoIme: string, lozinka: string, uloga: string): Promise<AuthResponse>;
}