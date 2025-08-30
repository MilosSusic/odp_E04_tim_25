import { UserAuthDataDto } from "../../Domain/DTOs/auth/UserAuthDto";
import { User } from "../../Domain/models/User";
import { IUserRepository } from "../../Domain/repositories/user/IUserRepository";
import { IAuthService } from "../../Domain/services/auth/IAuthService";
import bcrypt from "bcryptjs";

export class AuthService implements IAuthService {

  private userRepo: IUserRepository;
  private readonly saltRounds: number = parseInt(process.env.SALT_ROUNDS ?? "10", 10);


  public constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo;
  }

  async prijava(username: string, password: string): Promise<UserAuthDataDto> {
    const user = await this.userRepo.getByUsername(username);

    if (user.id !== 0 && await bcrypt.compare(password, user.password)) {
      return new UserAuthDataDto(user.id, user.username, user.role);
    }

    return new UserAuthDataDto();
  }

  async registracija(imePrezime: string, username: string, role: string, password: string): Promise<UserAuthDataDto> {
    const existingUser = await this.userRepo.getByUsername(username);
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const newUser = await this.userRepo.create(
      new User(0, imePrezime, username, role, hashedPassword)
    );

    if (existingUser.id !== 0) {
      return new UserAuthDataDto();
    }

    if (newUser.id !== 0) {
      return new UserAuthDataDto(newUser.id, newUser.username, newUser.role);
    }
    return new UserAuthDataDto();
  }

}