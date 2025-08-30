import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../connections/DbConnectionPool";
import { IFaultRepository } from "../../../Domain/repositories/fault/IFaultRepository";
import { Fault } from "../../../Domain/models/Fault";
import { FaultDto } from "../../../Domain/DTOs/fault/FaultDto";
import type { FaultStatus } from "../../../Domain/types/FaultStatus";


export class FaultRepository implements IFaultRepository {

  async create(fault: Fault): Promise<Fault> {
    try {
      const query = `
        INSERT INTO faults (userId, commentId, name, description, imageUrl, status, createdAt) 
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
        return new Fault(
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
      return new Fault();
    } catch (error) {
      console.error("Error creating fault:", error);
      return new Fault();
    }
  }

  async getById(id: number): Promise<FaultDto> {
    try {
      const query = `
        SELECT f.*, c.comment, CAST(c.price AS DECIMAL(10,2)) AS price
        FROM faults f 
        LEFT JOIN comments c ON f.commentId = c.id
        WHERE f.id = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new FaultDto(
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
      return new FaultDto();
    } catch (error) {
      console.error("Error getting fault by ID:", error);
      return new FaultDto();
    }
  }

  // Dohvati kvar po statusu
  async getByStatus(status: FaultStatus): Promise<FaultDto[]> {
    try {
      const query = `
        SELECT f.*, c.comment, CAST(c.price AS DECIMAL(10,2)) AS price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        WHERE f.status = ?
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [status]);
      return rows.map(row => new FaultDto(
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
      console.error("Error fetching faults by status:", error);
      return [];
    }
  }

  async getAll(): Promise<FaultDto[]> {
    try {
      const query = `
        SELECT f.*, c.comment, CAST(c.price AS DECIMAL(10,2)) AS price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        ORDER BY f.id ASC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(row => new FaultDto(
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
      console.error("Error fetching all faults:", error);
      return [];
    }
  }

  async update(fault: Fault): Promise<Fault> {
    try {
      const query = `
        UPDATE faults 
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
      return new Fault();
    } catch (error) {
      console.error("Error updating fault:", error);
      return new Fault();
    }
  }

  async getFaultsByUser(userId: number): Promise<FaultDto[]> {
    try {
      const query = `
        SELECT f.*, c.comment, CAST(c.price AS DECIMAL(10,2)) AS price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        WHERE f.userId = ?
        ORDER BY f.createdAt DESC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query, [userId]);
      return rows.map(row => new FaultDto(
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
      console.error("Error fetching user faults:", error);
      return [];
    }
  }

  async updateFaultStatus(faultId: number, status: FaultStatus): Promise<FaultDto> {
    try {
      const query = `UPDATE faults SET status = ? WHERE id = ?`;
      const [result] = await db.execute<ResultSetHeader>(query, [status, faultId]);

      if (result.affectedRows > 0) {
        return this.getById(faultId);
      }
      return new FaultDto();
    } catch (error) {
      console.error("Error updating fault status:", error);
      return new FaultDto();
    }
  }

  async getAllFaultsWithComments(): Promise<FaultDto[]> {
    try {
      const query = `
        SELECT f.*, c.comment, c.price
        FROM faults f
        LEFT JOIN comments c ON f.commentId = c.id
        ORDER BY f.createdAt DESC
      `;
      const [rows] = await db.execute<RowDataPacket[]>(query);
      return rows.map(row => new FaultDto(
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
      console.error("Error fetching all faults with comments:", error);
      return [];
    }
  }

  async resolveFault(faultId: number, status: string, comment: string, price: number): Promise<FaultDto> {

    const hasGetConn = typeof (db as any).getConnection === "function";
    const conn: any = hasGetConn ? await (db as any).getConnection() : db;
    const hasTx = typeof conn.beginTransaction === "function";

    try {
      if (hasTx) await conn.beginTransaction();

      const [ins] = (await conn.execute(
        "INSERT INTO comments (comment, price) VALUES (?, ?)",
        [comment, price]
      )) as [ResultSetHeader, unknown];

      const commentId = ins.insertId;

      await conn.execute(
        "UPDATE faults SET status = ?, commentId = ? WHERE id = ?",
        [status, commentId, faultId]
      );

      if (hasTx) await conn.commit();

      return await this.getById(faultId);
    } catch (err) {
      if (hasTx && typeof conn.rollback === "function") await conn.rollback();
      console.error("Error resolveFault:", err);
      return new FaultDto();
    } finally {
      if (hasGetConn && typeof conn.release === "function") conn.release();
    }
  }

}
