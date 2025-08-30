import type { FaultStatus } from "../../types/FaultStatus";

export class FaultDto {
  public constructor(
    public id: number = 0,
    public userId: number = 0,
    public name: string = '',
    public description: string = '',
    public imageUrl?: string,
    public status: FaultStatus = "Kreiran",
    public createdAt: Date = new Date(),
    public comment?: string,
    public price?: number
  ) { }
}

