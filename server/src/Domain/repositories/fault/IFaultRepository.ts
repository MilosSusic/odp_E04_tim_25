import { FaultDto } from "../../DTOs/fault/FaultDto";
import { Fault } from "../../models/Fault";
import type { FaultStatus } from "../../types/FaultStatus";

export interface IFaultRepository {
  create(fault: Fault): Promise<Fault>;
  getById(id: number): Promise<FaultDto>;
  getByStatus(status: FaultStatus): Promise<FaultDto[]>;
  getAll(): Promise<FaultDto[]>;
  update(fault: Fault): Promise<Fault>;
  getFaultsByUser(userId: number): Promise<FaultDto[]>;
  updateFaultStatus(faultId: number, status: FaultStatus): Promise<FaultDto>;
  getAllFaultsWithComments(): Promise<FaultDto[]>;
  resolveFault(faultId: number, status: string, comment: string, price: number): Promise<FaultDto>;
}
