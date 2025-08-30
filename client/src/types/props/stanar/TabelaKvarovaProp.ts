import type { Fault } from "../../../models/fault/Fault";

export type TabelaKvarovaProps = {
  items: Fault[];
  onAddNew: () => void;
  onLike: (id: number) => void;
};
