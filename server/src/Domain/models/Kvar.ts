import type { FaultStatus } from "../types/KvarStatus";

export class Kvar {
  public constructor(
    public id: number = 0,
    public userId: number = 0,
    public commentId: number = 0,
    public name: string = '',
    public description: string = '',
    public imageUrl?: string,
    public status: FaultStatus = "Kreiran",
    public createdAt: Date = new Date(),
  ) { }
}

