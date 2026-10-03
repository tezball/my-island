import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listPublicStays, type Stay } from "../stay/api";
import { listCounties, listPublishedPlaces, type County, type Place } from "../api/catalog";
import { useGuestSession } from "../auth/guestSession";
import { AccountSheet, AppHeader, BottomNav } from "../shell/Chrome";
import { applyFilters, inBounds, parseCsv } from "./filters";
import { formatKm, haversineKm, hasCoords } from "./geo";
import { PinSheet } from "./PinSheet";
import { PlaceCard } from "./PlaceCard";

const MapView = lazy(() => import("./map/MapView").then((m) => ({ default: m.MapView })));

export function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "map" ? "map" : "list";
  const q = params.get("q") ?? "";
  const county = parseCsv(params.get("county"));
  const [places, setPlaces] = useState<Place[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [geoOff, setGeoOff] = useState(false);
  const [pin, setPin] = useState<Place | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [sortAz, setSortAz] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { me } = useGuestSession();
  const [areaNeeded, setAreaNeeded] = useState(false);
  const [searchToken, setSearchToken] = useState(0);
  const [area, setArea] = useState<{
    west: number;
    south: number;
    east: number;
    north: number;
  } | null>(null);
  const [wide, setWide] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches,
  );

  useEffect(() => {
    document.title = "Explore — OPEN";
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const onChange = () => setWide(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listPublishedPlaces(), listCounties(), listPublicStays()])
      .then(([rows, countyRows, stayRows]) => {
        if (cancelled) return;
        setPlaces(rows);
        setCounties(countyRows);
        setStays(stayRows);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn’t load places.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => applyFilters(places, { q, county }, here),
    [places, q, county, here],
  );
  const visible = useMemo(() => {
    const rows = area ? filtered.filter((p) => inBounds(p, area)) : filtered;
    if (!sortAz) return rows;
    return [...rows].sort((a, b) => a.name.localeCompare(b.name));
  }, [filtered, area, sortAz]);
  const catalogCount = useMemo(
    () => places.filter((place) => place.category.id === "poi").length,
    [places],
  );

  const setView = (next: "list" | "map") => {
    const nextParams = new URLSearchParams(params);
    if (next === "list") nextParams.delete("view");
    else nextParams.set("view", "map");
    setParams(nextParams, { replace: true });
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoOff(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoOff(false);
      },
      () => {
        setHere(null);
        setGeoOff(true);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  useEffect(() => {
    locate();
  }, []);

  const setQuery = (value: string) => {
    const nextParams = new URLSearchParams(params);
    if (value) nextParams.set("q", value);
    else nextParams.delete("q");
    setParams(nextParams, { replace: true });
  };

  const selectCounty = (id: string | null) => {
    const nextParams = new URLSearchParams(params);
    if (id) nextParams.set("county", id);
    else nextParams.delete("county");
    setParams(nextParams, { replace: true });
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete("county");
    nextParams.delete("q");
    setParams(nextParams, { replace: true });
    setArea(null);
    setAreaNeeded(false);
    setSortAz(false);
  };

  const onSearchArea = useCallback(
    (bounds: { west: number; south: number; east: number; north: number }) => {
      setArea(bounds);
      setAreaNeeded(false);
    },
    [],
  );

  const showMap = view === "map" || wide;
  const showList = view === "list" || wide;
  const hasFilters = Boolean(q || county.length || area);
  const allSelected = county.length === 0;

  return (
    <div className={`explore ${view === "map" ? "is-map" : "is-list"}`}>
      <div className="explore-pane">
        <AppHeader
          title="Explore"
          onSearch={() => searchRef.current?.focus()}
          onAccount={() => setAccountOpen(true)}
        />
        {showList ? (
          <section className="discover">
            <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
              <span className="ms search-icon" aria-hidden="true">
                search
              </span>
              <input
                ref={searchRef}
                id="directory-search"
                value={q}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  catalogCount
                    ? `Search ${catalogCount} places, towns, counties…`
                    : "Search places, towns, counties…"
                }
                aria-label="Search places"
                autoComplete="off"
                spellCheck={false}
              />
              {q ? (
                <button
                  type="button"
                  className="clear-search"
                  aria-label="Clear search query"
                  onClick={() => {
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                >
                  <span className="ms">cancel</span>
                </button>
              ) : null}
            </form>
            <div className="chip-rail" id="category-rail">
              <button
                type="button"
                className={allSelected ? "category-chip is-on" : "category-chip"}
                aria-pressed={allSelected}
                onClick={() => selectCounty(null)}
              >
                All
                <span className="chip-count">{catalogCount}</span>
              </button>
              {counties.map((row) => {
                const on = county.includes(row.id);
                return (
                  <button
                    key={row.id}
                    type="button"
                    className={on ? "category-chip is-on" : "category-chip"}
                    aria-pressed={on}
                    onClick={() => selectCounty(on ? null : row.id)}
                  >
                    {row.name}
                  </button>
                );
              })}
            </div>
            <p className="result-count">
              <Link to="/stays">Stays</Link>
              {stays.length ? ` · ${stays.length} public` : ""}
            </p>
            <div className="result-row">
              <p className="result-count" aria-live="polite">
                <span className="status-dot" aria-hidden="true" />
                Showing {visible.length} places
              </p>
              <button type="button" className="sort-toggle" onClick={() => setSortAz((v) => !v)}>
                <span className="ms">swap_vert</span>
                <span>{sortAz ? "A–Z" : "Curated"}</span>
              </button>
            </div>
          </section>
        ) : null}
        {showList ? (
          <div className="field-note">
            <div>
              <p className="kicker">
                <span className="ms">sailing</span>
                Coastal atlas
              </p>
              <p className="field-title">Atlantic tides & seasonal access</p>
              <p className="field-body">
                {me
                  ? "Your Visited, Next, and Saved marks stay on the lists page."
                  : "Published places only. Sign in from Profile to keep a list."}
              </p>
            </div>
            <div className="field-icon" aria-hidden="true">
              <span className="ms">water</span>
            </div>
          </div>
        ) : null}
        {geoOff && showList ? (
          <p className="hint">Near-me is off. Showing Ireland, sorted by name.</p>
        ) : null}
        {error ? (
          <p className="status">{error}</p>
        ) : showList ? (
          visible.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                <span className="ms">explore_off</span>
              </div>
              <h2 className="place-name">No places found</h2>
              <p className="muted">
                Try another name or clear the county chip to see the full directory.
              </p>
              {hasFilters ? (
                <button type="button" className="primary" onClick={clearFilters}>
                  Reset filters
                </button>
              ) : null}
            </div>
          ) : (
            <ul className="place-list">
              {visible.map((place) => (
                <li key={place.id}>
                  <PlaceCard
                    place={place}
                    km={
                      here && hasCoords(place)
                        ? haversineKm(here.lat, here.lng, place.latitude, place.longitude)
                        : null
                    }
                  />
                </li>
              ))}
            </ul>
          )
        ) : null}
      </div>
      {showMap ? (
        <div className="map-wrap">
          <Suspense fallback={<p className="status">Loading map…</p>}>
            <MapView
              places={visible}
              here={here}
              onSelect={setPin}
              onBoundsCommitNeeded={setAreaNeeded}
              searchToken={searchToken}
              onSearchArea={onSearchArea}
            />
          </Suspense>
          {areaNeeded ? (
            <button
              className="search-area"
              type="button"
              onClick={() => setSearchToken((n) => n + 1)}
            >
              Search this area
            </button>
          ) : null}
          {visible.length === 0 ? <p className="map-empty">No places in this view.</p> : null}
          <button className="fab-locate" type="button" onClick={locate} aria-label="Locate me">
            <span className="ms">my_location</span>
          </button>
        </div>
      ) : null}
      {showList && !wide ? (
        <div className="map-fab">
          <button type="button" onClick={() => setView("map")}>
            <span className="ms">map</span>
            Interactive map view
            <span className="pulse" aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <BottomNav
        active={view === "map" && !wide ? "map" : "explore"}
        onAccount={() => setAccountOpen(true)}
      />
      {pin ? <PinSheet place={pin} onClose={() => setPin(null)} /> : null}
      {accountOpen ? <AccountSheet onClose={() => setAccountOpen(false)} /> : null}
      <ol className="sr-only">
        {visible.map((place) => (
          <li key={`sr-${place.id}`}>
            {place.name}, {place.county.name}
            {here && hasCoords(place)
              ? `, ${formatKm(haversineKm(here.lat, here.lng, place.latitude, place.longitude))}`
              : ""}
          </li>
        ))}
      </ol>
    </div>
  );
}
