export type ListsView = "list" | "map";

export function listsView(value: string | null): ListsView {
  return value === "map" ? "map" : "list";
}

/**
 * Phone shows one pane. Wide screens show the list and the map together, same as Explore.
 * Visited, Next, and Saved all use this rule.
 */
export function listsPanes(
  view: ListsView,
  wide: boolean,
): { showMap: boolean; showList: boolean } {
  const showMap = view === "map" || wide;
  const showList = view === "list" || wide;
  return { showMap, showList };
}
