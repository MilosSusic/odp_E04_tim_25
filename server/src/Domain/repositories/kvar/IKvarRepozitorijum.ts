import { KvarDto } from "../../DTOs/kvar/KvarDto";
import { Kvar } from "../../models/Kvar";
import type { FaultStatus } from "../../types/KvarStatus";

export interface IKvarRepozitorijum {
  create(fault: Kvar): Promise<Kvar>;
  getById(id: number): Promise<KvarDto>;
  getByStatus(status: FaultStatus): Promise<KvarDto[]>;
  getAll(): Promise<KvarDto[]>;
  update(fault: Kvar): Promise<Kvar>;
  getFaultsByUser(userId: number): Promise<KvarDto[]>;
  updateFaultStatus(faultId: number, status: FaultStatus): Promise<KvarDto>;
  getAllFaultsWithComments(): Promise<KvarDto[]>;
  resolveFault(faultId: number, status: string, comment: string, price: number): Promise<KvarDto>;
}
