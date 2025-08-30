import type { AuthResponse } from "../../types/auth/AuthResponse";
import axios from "axios";
import type { IAuthAPIService } from "./IAuthSevice";

const API_URL: string = import.meta.env.VITE_API_URL + "/auth";

export const authApi: IAuthAPIService = {
  async prijava(korisnickoIme: string, lozinka: string): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
        username: korisnickoIme,
        password: lozinka,
      });
      return res.data;
    } catch (error) {
      let message = "Greska prilikom prijave.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: undefined };
    }
  },

  async registracija(imePrezime: string, korisnickoIme: string, lozinka: string, uloga: string): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(`${API_URL}/register`, {
        imePrezime: imePrezime,
        username: korisnickoIme,
        role: uloga,
        password: lozinka,
      });
      return res.data;
    } catch (error) {
      let message = "Greska prilikom registracije.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return { success: false, message, data: undefined };
    }
  },
};
