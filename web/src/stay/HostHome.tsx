import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGuestSession } from "../auth/guestSession";
import { listHostStays, type Stay } from "./api";
import { StayWizard } from "./StayWizard";

export function HostHome() {
  const { me } = useGuestSession();
  const [stays, setStays] = useState<Stay[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Host";
    if (!me) return;
    listHostStays()
      .then(setStays)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load Stays"));
  }, [me]);

  if (!me) {
    return <p className="status">Sign in to add a Stay.</p>;
  }

  return (
    <main className="stay-page">
      <h1 className="place-name">Host</h1>
      {me.banned ? <p className="status">{me.banReason}</p> : null}
      {error ? <p className="status">{error}</p> : null}
      {me.banned ? null : (
        <Link className="primary" to="/host/stays/new">
          Add a Stay
        </Link>
      )}
      <ul className="place-list" id="host-stays">
        {stays.map((stay) => (
          <li key={stay.id}>
            <Link to={`/host/stays/${stay.id}`}>
              <span>{stay.title}</span>
              <span className="muted">
                {" "}
                {stay.kind} · {stay.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export function NewStayPage() {
  const { me } = useGuestSession();
  if (!me) return <p className="status">Sign in to add a Stay.</p>;
  if (me.banned) {
    return (
      <main className="stay-page">
        <h1 className="place-name">Host</h1>
        <p className="status">{me.banReason}</p>
      </main>
    );
  }
  return (
    <main className="stay-page">
      <Link to="/host">Host</Link>
      <StayWizard />
    </main>
  );
}
