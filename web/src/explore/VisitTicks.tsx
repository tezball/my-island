import type { Me } from "../api/auth";
import {
  deleteVisitIntent,
  putVisitIntent,
  type VisitMark,
} from "../api/visitIntent";

const MARKS: { id: VisitMark; label: string }[] = [
  { id: "been", label: "Been" },
  { id: "want", label: "Want" },
  { id: "never", label: "Never" },
];

export function VisitTicks({
  placeId,
  me,
  mark,
  onMark,
}: {
  placeId: string;
  me: Me | null;
  mark: VisitMark | undefined;
  onMark: (placeId: string, mark: VisitMark | undefined) => void;
}) {
  if (!me) {
    return <p className="tick-hint">Sign in to tick been, want, or never.</p>;
  }

  const set = async (next: VisitMark) => {
    const previous = mark;
    if (previous === next) {
      onMark(placeId, undefined);
      try {
        await deleteVisitIntent(placeId);
      } catch {
        onMark(placeId, previous);
      }
      return;
    }
    onMark(placeId, next);
    try {
      await putVisitIntent(placeId, next);
    } catch {
      onMark(placeId, previous);
    }
  };

  return (
    <div className="visit-ticks" role="group" aria-label="Visit intent">
      {MARKS.map((row) => (
        <button
          key={row.id}
          type="button"
          className="chip"
          aria-pressed={mark === row.id}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void set(row.id);
          }}
        >
          {row.label}
        </button>
      ))}
    </div>
  );
}
