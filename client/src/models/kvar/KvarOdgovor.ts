import type { Fault } from './Kvar';

export interface KvarOdgovor {
    success: boolean;
    message?: string;
    data?: Fault | Fault[];
}