import { KorisnikAuthDto } from "../../DTOs/auth/KorisnikAuthDto";


export interface IAuthService {

  prijava(username: string, password: string): Promise<KorisnikAuthDto>;
  
  registracija(imePrezime: string, username: string, role: string, password: string): Promise<KorisnikAuthDto>;

}