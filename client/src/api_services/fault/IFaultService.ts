import type { Fault } from "../../models/fault/Fault";
import type { FaultStatus } from "../../models/fault/FaultStatus";

export interface IFaultService {
  getMyFaults(token: string, userId: number): Promise<Fault[]>;
  getAllFaults(token: string): Promise<Fault[]>;
  getFaultsByStatus(token: string, status: FaultStatus): Promise<Fault[]>;
  createFault(token: string, fault: Partial<Fault>): Promise<Fault>;
  updateFaultStatus(token: string, id: number, status: FaultStatus): Promise<Fault>;
  resolveFault(token: string, id: number, payload: { status: FaultStatus; comment: string; price: number }): Promise<Fault>;
}
