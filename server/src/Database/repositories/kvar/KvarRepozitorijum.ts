import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../connections/DbConnectionPool";
import { IKvarRepozitorijum } from "../../../Domain/repositories/kvar/IKvarRepozitorijum";
import { Kvar } from "../../../Domain/models/Kvar";
import { KvarDto } from "../../../Domain/DTOs/kvar/KvarDto";
import type { FaultStatus } from "../../../Domain/types/KvarStatus";

export class KvarRepozitorijum implements IKvarRepozitorijum {

  async create(fault: Kvar): Promise<Kvar> {
    try {
      const query = `
        INSERT INTO kvarovi (userId, commentId, name, description, imageUrl, status, createdAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        fault.userId,
        fault.commentId,
        fault.name,
        fault.description,
        fault.imageUrl,
        fault.status,
        fault.createdAt,
      ]);

      if (result.insertId) {
        return new Kvar(
          result.insertId,
          fault.userId,
          fault.commentId,
          fault.name,
          fault.description,
          fault.imageUrl,
          fault.status,
          fault.createdAt
        );
      }
      return new Kvar();
    } catch (error) {
      console.error("Greška pri kreiranju kvara:", error);
      return new Kvar();
    }
  }

  async getById(id: number): Promise<KvarDto> {
    try {
      const query = `
        SELECT k.*, kom.comment, CAST(kom.price AS DECIMAL(10,2)) AS price
        FROM kvarovi k
        LEFT JOIN komentari kom ON k.commentId = kom.id
        WHERE k.id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new KvarDto(
          row.id,
          row.userId,
          row.name,
          row.description,
          row.imageUrl,
          row.status,
          row.createdAt,
          row.comment,
          row.price
        );
      }
      return new KvarDto();
    } catch (error) {
      console.error("Greška pri dohvatanju kvara po ID:", error);
      return new KvarDto();
    }
  }

  async getByStatus(status: FaultStatus): Promise<KvarDto[]> {
    try {
      const query = `
        SELECT k.*, kom.comment, CAST(kom.price AS DECIMAL(10,2)) AS price
        FROM kvarovi k
        LEFT JOIN komentari kom ON k.commentId = kom.id
        WHERE k.status = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [status]);
      return rows.map(row => new KvarDto(
        row.id,
        row.userId,
        row.name,
        row.description,
        row.imageUrl,
        row.status,
        row.createdAt,
        row.comment,
        row.price
      ));
    } catch (error) {
      console.error("Greška pri dohvatanju kvarova po statusu:", error);
      return [];
    }
  }

  async getAll(): Promise<KvarDto[]> {
    try {
      const query = `
        SELECT k.*, kom.comment, CAST(kom.price AS DECIMAL(10,2)) AS price
        FROM kvarovi k
        LEFT JOIN komentari kom ON k.commentId = kom.id
        ORDER BY k.id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(row => new KvarDto(
        row.id,
        row.userId,
        row.name,
        row.description,
        row.imageUrl,
        row.status,
        row.createdAt,
        row.comment,
        row.price
      ));
    } catch (error) {
      console.error("Greška pri dohvatanju svih kvarova:", error);
      return [];
    }
  }

  async update(fault: Kvar): Promise<Kvar> {
    try {
      const query = `
        UPDATE kvarovi
        SET description = ?, status = ?, imageUrl = ?
        WHERE id = ?
      `;
      const [result] = await db.execute<ResultSetHeader>(query, [
        fault.description,
        fault.status,
        fault.imageUrl,
        fault.id
      ]);

      if (result.affectedRows > 0) {
        return fault;
      }
      return new Kvar();
    } catch (error) {
      console.error("Greška pri ažuriranju kvara:", error);
      return new Kvar();
    }
  }

  async getFaultsByUser(userId: number): Promise<KvarDto[]> {
    try {
      const query = `
        SELECT k.*, kom.comment, CAST(kom.price AS DECIMAL(10,2)) AS price
        FROM kvarovi k
        LEFT JOIN komentari kom ON k.commentId = kom.id
        WHERE k.userId = ?
        ORDER BY k.createdAt DESC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);
      return rows.map(row => new KvarDto(
        row.id,
        row.userId,
        row.name,
        row.description,
        row.imageUrl,
        row.status,
        row.createdAt,
        row.comment,
        row.price
      ));
    } catch (error) {
      console.error("Greška pri dohvatanju kvarova korisnika:", error);
      return [];
    }
  }

  async updateFaultStatus(faultId: number, status: FaultStatus): Promise<KvarDto> {
    try {
      const query = `UPDATE kvarovi SET status = ? WHERE id = ?`;
      const [result] = await db.execute<ResultSetHeader>(query, [status, faultId]);

      if (result.affectedRows > 0) {
        return this.getById(faultId);
      }
      return new KvarDto();
    } catch (error) {
      console.error("Greška pri ažuriranju statusa kvara:", error);
      return new KvarDto();
    }
  }

  async getAllFaultsWithComments(): Promise<KvarDto[]> {
    try {
      const query = `
        SELECT k.*, kom.comment, kom.price
        FROM kvarovi k
        LEFT JOIN komentari kom ON k.commentId = kom.id
        ORDER BY k.createdAt DESC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(row => new KvarDto(
        row.id,
        row.userId,
        row.name,
        row.description,
        row.imageUrl,
        row.status,
        row.createdAt,
        row.comment,
        row.price
      ));
    } catch (error) {
      console.error("Greška pri dohvatanju svih kvarova sa komentarima:", error);
      return [];
    }
  }

  async resolveFault(faultId: number, status: string, comment: string, price: number): Promise<KvarDto> {

    const hasGetConn = typeof (db as any).getConnection === "function";
    const conn: any = hasGetConn ? await (db as any).getConnection() : db;
    const hasTx = typeof conn.beginTransaction === "function";

    try {
      if (hasTx) await conn.beginTransaction();

      const [ins] = (await conn.execute(
        "INSERT INTO komentari (comment, price) VALUES (?, ?)",
        [comment, price]
      )) as [ResultSetHeader, unknown];

      const commentId = ins.insertId;

      await conn.execute(
        "UPDATE kvarovi SET status = ?, commentId = ? WHERE id = ?",
        [status, commentId, faultId]
      );

      if (hasTx) await conn.commit();

      return await this.getById(faultId);
    } catch (err) {
      if (hasTx && typeof conn.rollback === "function") await conn.rollback();
      console.error("Greška pri resolveFault:", err);
      return new KvarDto();
    } finally {
      if (hasGetConn && typeof conn.release === "function") conn.release();
    }
  }

}