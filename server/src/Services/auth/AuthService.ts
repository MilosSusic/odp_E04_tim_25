import { KorisnikAuthDto } from "../../Domain/DTOs/auth/KorisnikAuthDto";
import { Korisnik } from "../../Domain/models/Korisnik";
import { IKorisnikRepozitorijum } from "../../Domain/repositories/korisnik/IKorisnikRepozitorijum";
import { IAuthService } from "../../Domain/services/auth/IAuthServis";
import bcrypt from "bcryptjs";

export class AuthService implements IAuthService {

  private userRepo: IKorisnikRepozitorijum;
  private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS ?? "10", 10);


  public constructor(userRepo: IKorisnikRepozitorijum) {
    this.userRepo = userRepo;
  }

  async prijava(username: string, password: string): Promise<KorisnikAuthDto> {
    const user = await this.userRepo.getByUsername(username);

    if (user.id !== 0 && await bcrypt.compare(password, user.password)) {
      return new KorisnikAuthDto(user.id, user.username, user.role);
    }

    return new KorisnikAuthDto();
  }

  async registracija(imePrezime: string, username: string, role: string, password: string): Promise<KorisnikAuthDto> {
    const existingUser = await this.userRepo.getByUsername(username);
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const newUser = await this.userRepo.create(
      new Korisnik(0, imePrezime, username, role, hashedPassword)
    );

    if (existingUser.id !== 0) {
      return new KorisnikAuthDto();
    }

    if (newUser.id !== 0) {
      return new KorisnikAuthDto(newUser.id, newUser.username, newUser.role);
    }
    return new KorisnikAuthDto();
  }

}