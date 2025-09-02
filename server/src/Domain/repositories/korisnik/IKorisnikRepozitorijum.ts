import { Korisnik } from "../../models/Korisnik";

export interface IKorisnikRepozitorijum {

  create(user: Korisnik): Promise<Korisnik>;

  getById(id: number): Promise<Korisnik>;

  getByUsername(username: string): Promise<Korisnik>;

  getAll(): Promise<Korisnik[]>;

  update(user:Korisnik): Promise<Korisnik>;

  delete(id: number): Promise<boolean>;

  exists(id: number): Promise<boolean>;
}