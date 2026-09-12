import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listCounties, listPublishedPlaces, type County, type Place } from "../api/catalog";
import { applyFilters, inBounds, parseCsv } from "./filters";
import { FilterSheet } from "./FilterSheet";
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
  const [counties, setCounties] = useState<County[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [geoOff, setGeoOff] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pin, setPin] = useState<Place | null>(null);
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
    Promise.all([listPublishedPlaces(), listCounties()])
      .then(([rows, countyRows]) => {
        if (cancelled) return;
        setPlaces(rows);
        setCounties(countyRows);
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
  const visible = useMemo(
    () => (area ? filtered.filter((p) => inBounds(p, area)) : filtered),
    [filtered, area],
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

  const toggleCounty = (id: string) => {
    const next = county.includes(id) ? county.filter((c) => c !== id) : [...county, id];
    const nextParams = new URLSearchParams(params);
    if (next.length) nextParams.set("county", next.join(","));
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

  return (
    <div className={`explore ${view === "map" ? "is-map" : "is-list"}`}>
      <div className="explore-pane">
        <header className="app-header">
          <h1 className="wordmark">
            Explore
            <span>Ireland · OPEN</span>
          </h1>
          <div className="count" aria-live="polite">
            {visible.length} places
          </div>
        </header>
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or town"
            aria-label="Search places"
          />
          <button className="bar-btn ghost" type="button" onClick={() => setFiltersOpen(true)}>
            Filters
          </button>
        </form>
        {geoOff ? (
          <p className="hint">Near-me is off. Showing Ireland, sorted by name.</p>
        ) : null}
        {error ? (
          <p className="status">{error}</p>
        ) : showList ? (
          visible.length === 0 ? (
            <p className="status">
              No places match.
              {hasFilters ? " Clear filters or pick another county." : ""}
            </p>
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
          {showMap && visible.length === 0 ? (
            <p className="map-empty">No places in this view.</p>
          ) : null}
          <button className="fab-locate" type="button" onClick={locate} aria-label="Locate me">
            ⌖
          </button>
        </div>
      ) : null}
      <nav className="bottom-bar">
        <button className="bar-btn" type="button" aria-pressed={view === "map"} onClick={() => setView("map")}>
          Map
        </button>
        <button className="bar-btn" type="button" aria-pressed={view === "list"} onClick={() => setView("list")}>
          List
        </button>
        <button className="bar-btn ghost" type="button" onClick={() => setFiltersOpen(true)}>
          Filters
        </button>
      </nav>
      {filtersOpen ? (
        <FilterSheet
          counties={counties}
          selected={county}
          onToggle={toggleCounty}
          onClear={clearFilters}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}
      {pin ? <PinSheet place={pin} onClose={() => setPin(null)} /> : null}
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
