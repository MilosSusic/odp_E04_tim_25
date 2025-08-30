// server/src/app.ts
import express from "express";
import cors from "cors";
import { AuthControler } from "./WebAPI/controllers/AuthController";
import { IAuthService } from "./Domain/services/auth/IAuthService";
import { AuthService } from "./Services/auth/AuthService";
import { UserRepository } from "./Database/repositories/user/UserRepository";
import { IUserRepository } from "./Domain/repositories/user/IUserRepository";
import { FaultController } from "./WebAPI/controllers/FaultController";
import { FaultRepository } from "./Database/repositories/fault/FaultRepository";
import { FaultService } from "./Services/fault/FaultService";
import { IFaultService } from "./Domain/services/fault/IFaultService";
import { IFaultRepository } from "./Domain/repositories/fault/IFaultRepository";

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const userRepo: IUserRepository = new UserRepository();
const authService: IAuthService = new AuthService(userRepo);
const authControler = new AuthControler(authService);

const faultRepo: IFaultRepository = new FaultRepository();
const faultService: IFaultService = new FaultService(faultRepo);
const faultController = new FaultController(faultService);


app.use("/api/v1", authControler.getRouter());
app.use("/api/v1/faults", faultController.getRouter());

export default app;
