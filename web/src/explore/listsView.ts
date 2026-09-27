import type { VisitMark } from "../api/visitIntent";

export type ListsView = "list" | "map";

export function listsView(value: string | null): ListsView {
  return value === "map" ? "map" : "list";
}

/**
 * Phone shows one pane. Wide screens show the list and the map together, same as Explore.
 * Never stays on the list.
 */
export function listsPanes(
  view: ListsView,
  wide: boolean,
  mark: VisitMark,
): { showMap: boolean; showList: boolean } {
  const showMap = mark !== "never" && (view === "map" || wide);
  const showList = view === "list" || wide || mark === "never";
  return { showMap, showList };
}
