import axios from "axios";
import type { Fault } from "../../models/kvar/Kvar";
import type { IKvarServis } from "../kvar/IKvarServis";
import type { FaultStatus } from "../../models/kvar/KvarStatus";

const API_URL: string = import.meta.env.VITE_API_URL + "/faults";

function authHeader(token: string) {
    return { Authorization: `Bearer ${token}` };
}

function normalizeToArray<T>(x: T | T[] | undefined | null): T[] {
    if (!x) return [];
    return Array.isArray(x) ? x : [x];
}


type ApiEnvelope<T> = { success: boolean; message?: string; data?: T };


export const faultApi: IKvarServis = {

    async getMyFaults(token, userId) {
        const res = await axios.get(`${API_URL}/user/${userId}`, { headers: authHeader(token) });
        if (!res.data.success) throw new Error(res.data.message || "Greška pri učitavanju kvarova.");
        return normalizeToArray(res.data.data);
    },

    async getAllFaults(token) {
        const res = await axios.get<ApiEnvelope<Fault | Fault[]>>(`${API_URL}`, { headers: authHeader(token) });
        if (!res.data.success) throw new Error(res.data.message || "Greška pri učitavanju kvarova.");
        return normalizeToArray(res.data.data);
    },

    async getFaultsByStatus(token, status) {
        const url = `${API_URL}/status/${encodeURIComponent(status)}`;
        const res = await axios.get<ApiEnvelope<Fault | Fault[]>>(url, { headers: authHeader(token) });
        if (!res.data.success) throw new Error(res.data.message || "Greška pri filtriranju kvarova.");
        return normalizeToArray(res.data.data);
    },

    async createFault(token, fault) {
        const res = await axios.post<ApiEnvelope<Fault>>(
            `${API_URL}`,
            fault,
            { headers: { ...authHeader(token), "Content-Type": "application/json" } }
        );
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Greška pri kreiranju kvara.");
        }
        return res.data.data;
    },

    async updateFaultStatus(token, id, status) {
        const res = await axios.put<ApiEnvelope<Fault>>(
            `${API_URL}/${id}/status`,
            { status },
            { headers: { ...authHeader(token), "Content-Type": "application/json" } }
        );
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Greška pri izmeni statusa.");
        }
        return res.data.data;
    },

    async resolveFault(token, id, payload: { status: FaultStatus; comment: string; price: number }) {
        const res = await axios.put<ApiEnvelope<Fault>>(
            `${API_URL}/${id}/resolve`,
            payload,
            { headers: { ...authHeader(token), "Content-Type": "application/json" } }
        );
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Greška pri zaključivanju kvara.");
        }
        return res.data.data;
    },
};
