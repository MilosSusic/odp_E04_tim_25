import { FaultDto } from "../../Domain/DTOs/fault/FaultDto";
import { Fault } from "../../Domain/models/Fault";
import { IFaultRepository } from "../../Domain/repositories/fault/IFaultRepository";
import { IFaultService } from "../../Domain/services/fault/IFaultService";
import type { FaultStatus } from "../../Domain/types/FaultStatus";


export class FaultService implements IFaultService {
  constructor(private faultRepo: IFaultRepository) { }

  async createFault(fault: Fault): Promise<FaultDto> {
    if (!fault.name || !fault.description) {
      throw new Error("Naziv i opis kvara su obavezni");
    }
    return await this.faultRepo.create(fault);
  }

  async resolveFault(faultId: number, status: FaultStatus, comment: string, price: number) {

    return await this.faultRepo.resolveFault(faultId, status, comment, price);
  }

  async getFaultById(id: number): Promise<FaultDto> {
    return await this.faultRepo.getById(id);
  }

  async getAllFaults(): Promise<FaultDto[]> {
    return await this.faultRepo.getAllFaultsWithComments();
  }

  async getFaultsByUser(userId: number): Promise<FaultDto[]> {
    return await this.faultRepo.getFaultsByUser(userId);
  }

  async getFaultsByStatus(status: FaultStatus): Promise<FaultDto[]> {
    return await this.faultRepo.getByStatus(status);
  }

  async updateFault(fault: Fault): Promise<FaultDto> {
    return await this.faultRepo.update(fault);
  }

  async updateFaultStatus(faultId: number, status: FaultStatus): Promise<FaultDto> {
    return await this.faultRepo.updateFaultStatus(faultId, status);
  }
}
