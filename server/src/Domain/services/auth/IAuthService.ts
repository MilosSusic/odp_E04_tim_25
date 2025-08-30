import { UserAuthDataDto } from "../../DTOs/auth/UserAuthDto";


export interface IAuthService {

  prijava(username: string, password: string): Promise<UserAuthDataDto>;
  
  registracija(imePrezime: string, username: string, role: string, password: string): Promise<UserAuthDataDto>;

}