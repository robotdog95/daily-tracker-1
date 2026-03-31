

import { CalendarView } from "./CalendarView.mjs";
import { StatsView } from "./StatsView.mjs";
import { DBView } from "./DBView.mjs";
import { FilterView } from "./FilterView.mjs";
import { EditView } from "./EditView.mjs";
import { ConfigView } from "./ConfigView.mjs";
import { PlannerView } from "./PlannerView.mjs";
import { DragBase } from "./draggableCard.mjs";
import { CreateTracker } from "./CreateTracker.mjs";
import { IconCheckbox } from "./IconCheckbox.mjs";
import { SlidingTab } from "./SlidingTab.mjs";
import { IconSelector } from "./IconSelector.mjs";
import { TrackerCard } from "./TrackerCard.mjs";
import { StarSystem } from "./StarSystem.mjs";
import { TimeSlider } from "./TimeSlider.mjs";
import { ColorPicker } from "./ColorPicker.mjs";
import { TrackerManagerView } from "./TrackerManagerView.mjs";
import { EditTracker } from "./EditTracker.mjs";
import { PromptView } from "./PromptView.mjs";

export const AppComponents = {
  promptview: PromptView,
  edittracker: EditTracker,
  trackermanager: TrackerManagerView,
  starsystem: StarSystem,
  trackercard: TrackerCard,
  calendar: CalendarView,
  planner: PlannerView,
  stats: StatsView,
  dbview: DBView,
  filter: FilterView,
  edit: EditView,
  config: ConfigView,
  createtracker: CreateTracker,
  iconcheckbox: IconCheckbox,
  slidingtab: SlidingTab,
  iconselector: IconSelector,
  timeslider: TimeSlider,
  colorpicker: ColorPicker
};
