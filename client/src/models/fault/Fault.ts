import type { FaultStatus } from "./FaultStatus";

export class Fault {
  id: number = 0;
  userId: number = 0;
  commentId?: number | null = null;
  name: string = "";
  description: string = "";
  imageUrl?: string | null = null;
  status: FaultStatus = "Kreiran";
  createdAt: string | Date = new Date();
  comment?: string | null = null;
  price?: number | null = null;
}

