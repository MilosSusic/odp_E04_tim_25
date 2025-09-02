import { Router, Request, Response } from "express";
import { IFaultService } from "../../Domain/services/kvar/IKvarServis";
import { Kvar } from "../../Domain/models/Kvar";
import { normalizeFaultStatus } from "../../Domain/types/KvarStatus";

export class FaultController {
  private router: Router;
  private faultService: IFaultService;

  constructor(faultService: IFaultService) {
    this.router = Router();
    this.faultService = faultService;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // SVE rute su relativne na /api/v1/faults
    this.router.get("/user/:userId", this.getFaultsByUser.bind(this));
    this.router.get("/", this.getAllFaults.bind(this));                    // GET /api/v1/faults?status=...
    this.router.get("/status/:status", this.getFaultsByStatusParam.bind(this)); // GET /api/v1/faults/status/:status
    this.router.post("/", this.createFault.bind(this));
    this.router.put("/:id/status", this.updateFaultStatus.bind(this));
    this.router.put("/:id/resolve", this.resolveFault.bind(this));         // ⬅️ FIX
  }

  private async getFaultsByUser(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const faults = await this.faultService.getFaultsByUser(userId);
      res.json({ success: true, data: faults });
    } catch {
      res.status(500).json({ success: false, message: "Neuspešno učitavanje kvarova za osobu" });
    }
  }

  private async getAllFaults(req: Request, res: Response) {
    try {
      const raw = (req.query.status as string | undefined)?.trim();
      if (raw) {
        const normalized = normalizeFaultStatus(raw);
        if (!normalized) return res.status(400).json({ success: false, message: "Nepoznat status" });
        const filtered = await this.faultService.getFaultsByStatus(normalized);
        return res.json({ success: true, data: filtered });
      }
      const faults = await this.faultService.getAllFaults();
      res.json({ success: true, data: faults });
    } catch {
      res.status(500).json({ success: false, message: "Neuspešno učitavanje kvarova" });
    }
  }

  private async getFaultsByStatusParam(req: Request, res: Response) {
    try {
      const normalized = normalizeFaultStatus(req.params.status);
      if (!normalized) return res.status(400).json({ success: false, message: "Nepoznat status" });
      const faults = await this.faultService.getFaultsByStatus(normalized);
      res.json({ success: true, data: faults });
    } catch {
      res.status(500).json({ success: false, message: "Neuspešno učitavanje kvarova po statusu" });
    }
  }

  private async createFault(req: Request, res: Response) {
    try {
      const { userId, name, description, imageUrl } = req.body;
      const fault = new Kvar(0, userId, 0, name, description, imageUrl);
      const result = await this.faultService.createFault(fault);
      res.status(201).json({ success: true, data: result });
    } catch {
      res.status(500).json({ success: false, message: "Neuspešno prijavljivanje kvara" });
    }
  }

  private async updateFaultStatus(req: Request, res: Response) {
    try {
      const faultId = Number(req.params.id);
      const normalized = normalizeFaultStatus((req.body as { status?: unknown })?.status);
      if (!normalized) return res.status(400).json({ success: false, message: "Nepoznat status" });
      const updatedFault = await this.faultService.updateFaultStatus(faultId, normalized);
      res.json({ success: true, data: updatedFault });
    } catch {
      res.status(500).json({ success: false, message: "Neuspešno menjanje statusa kvara" });
    }
  }

  private async resolveFault(req: Request, res: Response) {
    try {
      const faultId = Number(req.params.id);
      const { status, comment, price } = req.body as { status?: unknown; comment?: unknown; price?: unknown };

      const normalized = normalizeFaultStatus(status);
      if (!normalized || (normalized !== "Saniran" && normalized !== "Problem nije rešen")) {
        return res.status(400).json({ success: false, message: "Status mora biti 'Saniran' ili 'Problem nije rešen'." });
      }

      const commentStr = String(comment ?? "").trim();
      const priceNum = Number(price);
      if (!commentStr) return res.status(400).json({ success: false, message: "Komentar je obavezan." });
      if (!Number.isFinite(priceNum) || priceNum < 0) {
        return res.status(400).json({ success: false, message: "Cena mora biti broj ≥ 0." });
      }
      if (commentStr.length > 120) {
        return res.status(400).json({ success: false, message: "Komentar može imati najviše 120 karaktera." });
      }

      const updated = await this.faultService.resolveFault(faultId, normalized, commentStr, priceNum);
      return res.json({ success: true, data: updated });
    } catch (e) {
      console.error("resolveFault error:", e);
      return res.status(500).json({ success: false, message: "Neuspešno zaključivanje kvara" });
    }
  }

  public getRouter() { return this.router; }
}
