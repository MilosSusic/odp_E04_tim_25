import { KvarDto } from "../../Domain/DTOs/kvar/KvarDto";
import { Kvar } from "../../Domain/models/Kvar";
import { IKvarRepozitorijum } from "../../Domain/repositories/kvar/IKvarRepozitorijum";
import { IFaultService } from "../../Domain/services/kvar/IKvarServis";
import type { FaultStatus } from "../../Domain/types/KvarStatus";


export class FaultService implements IFaultService {
  constructor(private faultRepo: IKvarRepozitorijum) { }

  async createFault(fault: Kvar): Promise<KvarDto> {
    if (!fault.name || !fault.description) {
      throw new Error("Naziv i opis kvara su obavezni");
    }
    return await this.faultRepo.create(fault);
  }

  async resolveFault(faultId: number, status: FaultStatus, comment: string, price: number) {

    return await this.faultRepo.resolveFault(faultId, status, comment, price);
  }

  async getFaultById(id: number): Promise<KvarDto> {
    return await this.faultRepo.getById(id);
  }

  async getAllFaults(): Promise<KvarDto[]> {
    return await this.faultRepo.getAllFaultsWithComments();
  }

  async getFaultsByUser(userId: number): Promise<KvarDto[]> {
    return await this.faultRepo.getFaultsByUser(userId);
  }

  async getFaultsByStatus(status: FaultStatus): Promise<KvarDto[]> {
    return await this.faultRepo.getByStatus(status);
  }

  async updateFault(fault: Kvar): Promise<KvarDto> {
    return await this.faultRepo.update(fault);
  }

  async updateFaultStatus(faultId: number, status: FaultStatus): Promise<KvarDto> {
    return await this.faultRepo.updateFaultStatus(faultId, status);
  }
}
