import { CalendarView } from "./CalendarView.mjs";
import { StatsView } from "./StatsView.mjs";
import { DBView } from "./DBView.mjs";
import { FilterView } from "./FilterView.mjs";
import { EditView } from "./EditView.mjs";
import { ConfigView } from "./ConfigView.mjs";
import { PlannerView } from "./PlannerView.mjs";
import { Draggable, DragContainer} from "./draggableCard.mjs";

export const AppComponents = {
  calendar: CalendarView,
  planner: PlannerView,
  stats: StatsView,
  dbview: DBView,
  filter: FilterView,
  edit: EditView,
  config: ConfigView,
};
