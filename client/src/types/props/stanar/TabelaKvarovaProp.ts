import type { Fault } from "../../../models/kvar/Kvar";

export type TabelaKvarovaProps = {
  items: Fault[];
  onAddNew: () => void;
  onLike: (id: number) => void;
};
