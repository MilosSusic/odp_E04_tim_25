// server/src/app.ts
import express from "express";
import cors from "cors";
import { AuthControler } from "./WebAPI/controllers/AuthController";
import { IAuthService } from "./Domain/services/auth/IAuthServis";
import { AuthService } from "./Services/auth/AuthService";
import { UserRepository } from "./Database/repositories/korisnik/KorisnikRepozitorijum";
import { IKorisnikRepozitorijum } from "./Domain/repositories/korisnik/IKorisnikRepozitorijum";
import { FaultController } from "./WebAPI/controllers/KvarController";
import { KvarRepozitorijum } from "./Database/repositories/kvar/KvarRepozitorijum";
import { FaultService } from "./Services/kvar/KvarServis";
import { IFaultService } from "./Domain/services/kvar/IKvarServis";
import { IKvarRepozitorijum } from "./Domain/repositories/kvar/IKvarRepozitorijum";

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const userRepo: IKorisnikRepozitorijum = new UserRepository();
const authService: IAuthService = new AuthService(userRepo);
const authControler = new AuthControler(authService);

const faultRepo: IKvarRepozitorijum = new KvarRepozitorijum();
const faultService: IFaultService = new FaultService(faultRepo);
const faultController = new FaultController(faultService);


app.use("/api/v1", authControler.getRouter());
app.use("/api/v1/faults", faultController.getRouter());

export default app;
