import { UserDto } from "../../Domain/DTOs/user/UserDto";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/user/IUserRepository";


export class UserService {
  public constructor(private userRepository: IUserRepository) { }

  async getAllUsers(): Promise<UserDto[]> {
    const korisnici: User[] = await this.userRepository.getAll();
    const korisniciDto: UserDto[] = korisnici.map(
      (user) => new UserDto(user.id, user.imePrezime, user.username, user.role)
    );

    return korisniciDto;
  }
}