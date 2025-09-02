import { Router, Request, Response } from "express";
import { IAuthService } from "../../Domain/services/auth/IAuthServis";
import { validacijaPodatakaAuth } from "../validators/auth/AuthRequestValidator";
import jwt from "jsonwebtoken";

export class AuthControler {
  private router: Router;
  private authUser: IAuthService;

  constructor(authService: IAuthService) {
    this.router = Router();
    this.authUser = authService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/auth/login", this.prijava.bind(this));
    this.router.post("/auth/register", this.registracija.bind(this));
  }

  private async prijava(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // Validacija inputa
      const validacijaOK = validacijaPodatakaAuth(username, password);
      if (!validacijaOK.uspesno) {
        res.status(400).json({ success: false, message: validacijaOK.poruka });
        return;
      }

      const result = await this.authUser.prijava(username, password);

      if (result.id !== 0) {
        const token = jwt.sign(
          {
            id: result.id,
            korisnickoIme: result.username,
            uloga: result.role,
          },
          process.env.JWT_SECRET ?? "",
          { expiresIn: "6h" }
        );

        res.status(200).json({ success: true, message: "Uspešna prijava", data: token });
      } else {
        res.status(401).json({ success: false, message: "Neispravno korisničko ime ili lozinka" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Desila se greška na serveru" });
    }
  }

  private async registracija(req: Request, res: Response): Promise<void> {
    try {
      const { imePrezime, username, password, role } = req.body;

      const validacijaOK = validacijaPodatakaAuth(username, password);
      if (!validacijaOK.uspesno) {
        res.status(400).json({ success: false, message: validacijaOK.poruka });
        return;
      }

      const result = await this.authUser.registracija(imePrezime, username, role, password);

      if (result.id !== 0) {
        const token = jwt.sign(
          {
            id: result.id,
            korisnickoIme: result.username,
            uloga: result.role,
          },
          process.env.JWT_SECRET ?? "",
          { expiresIn: "6h" }
        );

        res.status(201).json({ success: true, message: "Uspešna registracija", data: token });
      } else {
        res.status(401).json({ success: false, message: "Registracija nije uspela. Korisničko ime već postoji." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Desila se greška na serveru" });
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
