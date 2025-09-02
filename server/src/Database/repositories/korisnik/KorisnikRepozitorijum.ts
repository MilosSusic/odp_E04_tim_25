import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Korisnik } from "../../../Domain/models/Korisnik";

import db from "../../connections/DbConnectionPool";
import { IKorisnikRepozitorijum } from "../../../Domain/repositories/korisnik/IKorisnikRepozitorijum";

export class KorisnikRepozitorijum implements IKorisnikRepozitorijum {
  async create(user: Korisnik): Promise<Korisnik> {
    try {
      const query = `
        INSERT INTO korisnici (ime_prezime, username, role, password) 
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.imePrezime,
        user.username,
        user.role,
        user.password,
      ]);

      if (result.insertId) {
        return new Korisnik(result.insertId, user.imePrezime, user.username, user.role, user.password);
      }

      return new Korisnik();
    } catch (error) {
      console.error("Greška pri kreiranju korisnika:", error);
      return new Korisnik();
    }
  }

  async getById(id: number): Promise<Korisnik> {
    try {
      const query = `SELECT id, ime_prezime, username, role, password FROM korisnici WHERE id = ?`;
      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      if (rows.length > 0) {
        const row = rows[0];
        return new Korisnik(row.id, row.ime_prezime, row.username, row.role, row.password);
      }

      return new Korisnik();
    } catch {
      return new Korisnik();
    }
  }

  async getByUsername(username: string): Promise<Korisnik> {
    try {
      const query = `
        SELECT id, ime_prezime, username, role, password
        FROM korisnici 
        WHERE username = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [username]);
      if (rows.length > 0) {
        const row = rows[0];
        return new Korisnik(row.id, row.ime_prezime, row.username, row.role, row.password);
      }

      return new Korisnik();
    } catch (error) {
      console.log("Greška getByUsername:", error);
      return new Korisnik();
    }
  }

  async getAll(): Promise<Korisnik[]> {
    try {
      const query = `SELECT id, ime_prezime, username, role, password FROM korisnici ORDER BY id ASC`;
      const [rows] = await db.execute<RowDataPacket[]>(query);

      return rows.map(
        (row) => new Korisnik(row.id, row.ime_prezime, row.username, row.role, row.password)
      );
    } catch {
      return [];
    }
  }

  async update(user: Korisnik): Promise<Korisnik> {
    try {
      const query = `
        UPDATE korisnici 
        SET ime_prezime = ?, username = ?, role = ?, password = ?
        WHERE id = ?
      `;

      const [result] = await db.execute<ResultSetHeader>(query, [
        user.imePrezime,
        user.username,
        user.role,
        user.password,
        user.id,
      ]);

      if (result.affectedRows > 0) {
        return user;
      }

      return new Korisnik();
    } catch {
      return new Korisnik();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM korisnici WHERE id = ?`;

      const [result] = await db.execute<ResultSetHeader>(query, [id]);

      return result.affectedRows > 0;
    } catch {
      return false;
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM korisnici 
        WHERE id = ?
      `;

      const [rows] = await db.execute<RowDataPacket[]>(query, [id]);

      return rows[0].count > 0;
    } catch {
      return false;
    }
  }
}