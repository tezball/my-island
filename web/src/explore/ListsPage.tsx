import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listPublishedPlaces, type Place } from "../api/catalog";
import { isVisitMark, placesForMark, type VisitMark } from "../api/visitIntent";
import { PlaceCard } from "./PlaceCard";
import { useGuestSession } from "../auth/guestSession";

export function ListsPage() {
  const { me, marks } = useGuestSession();
  const [params, setParams] = useSearchParams();
  const requested = params.get("mark") ?? "been";
  const mark: VisitMark = isVisitMark(requested) ? requested : "been";
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    document.title = "My lists — OPEN";
  }, []);

  useEffect(() => {
    let cancelled = false;
    listPublishedPlaces()
      .then((rows) => {
        if (!cancelled) setPlaces(rows);
      })
      .catch(() => {
        if (!cancelled) setPlaces([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => placesForMark(places, marks, mark), [places, marks, mark]);

  const setMark = (next: VisitMark) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("mark", next);
    setParams(nextParams, { replace: true });
  };

  return (
    <div className="explore is-list">
      <div className="explore-pane">
        <header className="app-header">
          <h1 className="wordmark">
            Lists
            <span>Private to you</span>
          </h1>
        </header>
        {!me ? (
          <p className="status">
            Sign in on Explore to see been, want, and never lists.{" "}
            <Link to="/">Back to Explore</Link>
          </p>
        ) : (
          <>
            <div className="chip-row">
              {(["been", "want", "never"] as VisitMark[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  aria-pressed={mark === id}
                  onClick={() => setMark(id)}
                >
                  {id}
                </button>
              ))}
            </div>
            {rows.length === 0 ? (
              <p className="status">Nothing marked {mark} yet.</p>
            ) : (
              <ul className="place-list">
                {rows.map((place) => (
                  <li key={place.id}>
                    <PlaceCard place={place} km={null} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <nav className="bottom-bar">
        <Link className="bar-btn ghost" to="/">
          Explore
        </Link>
      </nav>
    </div>
  );
}
