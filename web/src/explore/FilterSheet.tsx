import type { County } from "../api/catalog";

export function FilterSheet({
  counties,
  selected,
  onToggle,
  onClear,
  onClose,
}: {
  counties: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const set = new Set(selected);
  return (
    <>
      <button className="backdrop" aria-label="Close filters" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="filters-title">
        <h2 id="filters-title">Counties</h2>
        <div className="chip-row">
          {counties.map((county: County) => (
            <button
              key={county.id}
              className="chip"
              aria-pressed={set.has(county.id)}
              onClick={() => onToggle(county.id)}
            >
              {county.name}
            </button>
          ))}
        </div>
        <p>
          <button className="bar-btn ghost" type="button" onClick={onClear}>
            Clear filters
          </button>{" "}
          <button className="primary" type="button" onClick={onClose}>
            Done
          </button>
        </p>
      </div>
    </>
  );
}
