import type { Fault } from './Fault';

export interface FaultResponse {
    success: boolean;
    message?: string;
    data?: Fault | Fault[];
}