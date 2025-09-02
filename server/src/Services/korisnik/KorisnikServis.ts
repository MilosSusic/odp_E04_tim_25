import { KorisnikDto } from "../../Domain/DTOs/korisnik/KorisnikDto";
import { Korisnik } from "../../Domain/models/Korisnik";
import { IKorisnikRepozitorijum } from "../../Domain/repositories/korisnik/IKorisnikRepozitorijum";


export class UserService {
  public constructor(private userRepository: IKorisnikRepozitorijum) { }

  async getAllUsers(): Promise<KorisnikDto[]> {
    const korisnici: Korisnik[] = await this.userRepository.getAll();
    const korisniciDto: KorisnikDto[] = korisnici.map(
      (user) => new Korisnik(user.id, user.imePrezime, user.username, user.role)
    );

    return korisniciDto;
  }
}