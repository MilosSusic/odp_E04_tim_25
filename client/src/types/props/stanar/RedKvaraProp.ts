import type { Fault } from "../../../models/kvar/Kvar";

export type RedKvaraProps = {
    fault: Fault;
    onLike: (id: number) => void;
};