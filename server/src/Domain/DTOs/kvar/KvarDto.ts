import type { FaultStatus } from "../../types/KvarStatus";

export class KvarDto {
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

