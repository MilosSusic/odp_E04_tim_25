import type { KvarDto } from "../../DTOs/kvar/KvarDto";
import type { Kvar } from "../../models/Kvar";
import type { FaultStatus } from "../../types/KvarStatus";

export interface IFaultService {
  createFault(fault: Kvar): Promise<KvarDto>;
  getFaultById(id: number): Promise<KvarDto>;
  getAllFaults(): Promise<KvarDto[]>;
  getFaultsByUser(userId: number): Promise<KvarDto[]>;
  getFaultsByStatus(status: FaultStatus): Promise<KvarDto[]>;
  updateFault(fault: Kvar): Promise<KvarDto>;
  updateFaultStatus(faultId: number, status: FaultStatus): Promise<KvarDto>;
  resolveFault(faultId: number, status: FaultStatus, comment: string, price: number): Promise<KvarDto>;
}

