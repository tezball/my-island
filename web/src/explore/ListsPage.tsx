import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listPublishedPlaces, type Place } from "../api/catalog";
import { isVisitMark, placesForMark, placesOnMap, type VisitMark } from "../api/visitIntent";
import { PlaceCard } from "./PlaceCard";
import { useGuestSession } from "../auth/guestSession";

const MapView = lazy(() => import("./map/MapView").then((m) => ({ default: m.MapView })));

export function ListsPage() {
  const { me, marks } = useGuestSession();
  const [params, setParams] = useSearchParams();
  const requested = params.get("mark") ?? "been";
  const mark: VisitMark = isVisitMark(requested) ? requested : "been";
  const view = params.get("view") === "map" ? "map" : "list";
  const [places, setPlaces] = useState<Place[]>([]);
  const [pin, setPin] = useState<Place | null>(null);

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
  const pins = useMemo(() => placesOnMap(places, marks, mark), [places, marks, mark]);

  const setMark = (next: VisitMark) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("mark", next);
    setParams(nextParams, { replace: true });
  };

  const setView = (next: "list" | "map") => {
    const nextParams = new URLSearchParams(params);
    if (next === "list") nextParams.delete("view");
    else nextParams.set("view", "map");
    setParams(nextParams, { replace: true });
  };

  const showMap = view === "map" && mark !== "never";

  return (
    <div className={`explore ${showMap ? "is-map" : "is-list"}`}>
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
            {showMap ? null : rows.length === 0 ? (
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
            {view === "map" && mark === "never" ? (
              <p className="status">Never stays on the list.</p>
            ) : null}
          </>
        )}
      </div>
      {showMap && me ? (
        <div className="map-wrap">
          <Suspense fallback={<p className="status">Loading map…</p>}>
            <MapView
              places={pins}
              here={null}
              onSelect={setPin}
              onBoundsCommitNeeded={() => undefined}
              searchToken={0}
              onSearchArea={() => undefined}
            />
          </Suspense>
          {pins.length === 0 ? <p className="map-empty">No {mark} pins.</p> : null}
          {pin ? (
            <p className="map-empty">
              <Link to={`/places/${pin.slug}`}>{pin.name}</Link>
            </p>
          ) : null}
        </div>
      ) : null}
      <nav className="bottom-bar">
        <Link className="bar-btn ghost" to="/">
          Explore
        </Link>
        {me ? (
          <>
            <button
              className="bar-btn"
              type="button"
              aria-pressed={view === "map"}
              onClick={() => setView("map")}
            >
              Map
            </button>
            <button
              className="bar-btn"
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              List
            </button>
          </>
        ) : null}
      </nav>
    </div>
  );
}
