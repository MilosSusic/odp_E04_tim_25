import type { Fault } from "../../../models/fault/Fault";

export type RedKvaraProps = {
    fault: Fault;
    onLike: (id: number) => void;
};