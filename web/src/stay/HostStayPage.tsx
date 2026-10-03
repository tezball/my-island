import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eur, getHostStay, type Stay } from "./api";
import { StayWizard } from "./StayWizard";

export function HostStayPage() {
  const { id } = useParams();
  const [stay, setStay] = useState<Stay | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = () => {
      getHostStay(id)
        .then((row) => {
          if (!cancelled) setStay(row);
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err.message : "Could not load this Stay");
        });
    };
    load();
    const timer = window.setInterval(load, 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [id]);

  if (error) return <p className="status">{error}</p>;
  if (!stay) return <p className="status">Loading…</p>;

  return (
    <main className="stay-page">
      <Link to="/host">Host</Link>
      <h1 className="place-name">{stay.title || "Stay"}</h1>
      <p>
        {stay.kind} · <span data-stay-status={stay.status}>{stay.status}</span>
      </p>
      {stay.status === "submitted" ? (
        <p className="muted">This Stay is hidden until review finishes.</p>
      ) : null}
      {stay.status === "hidden" ? <p className="status">Rejected. This Stay stays hidden.</p> : null}
      {stay.feedback ? <p className="status">{stay.feedback}</p> : null}
      {stay.banReason ? <p className="status">{stay.banReason}</p> : null}
      {eur(stay.cost) ? <p>{eur(stay.cost)}</p> : null}
      {editing ? (
        <StayWizard stayId={stay.id} />
      ) : (
        <button type="button" className="bar-btn ghost" onClick={() => setEditing(true)}>
          Edit Stay
        </button>
      )}
    </main>
  );
}
