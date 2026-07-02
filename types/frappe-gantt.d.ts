declare module "frappe-gantt" {
  export type FrappeGanttTask = {
    id: string;
    name: string;
    start: string;
    end: string;
    progress?: number;
    dependencies?: string;
    custom_class?: string;
  };

  export type FrappeGanttOptions = {
    view_mode?: "Hour" | "Quarter Day" | "Half Day" | "Day" | "Week" | "Month" | "Year";
    date_format?: string;
    readonly?: boolean;
    [key: string]: unknown;
  };

  export default class Gantt {
    constructor(
      wrapper: HTMLElement | string,
      tasks: FrappeGanttTask[],
      options?: FrappeGanttOptions,
    );
  }
}
