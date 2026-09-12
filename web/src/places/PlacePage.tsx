import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPlace, listPublishedPlaces, type Place } from "../api/catalog";
import { PlaceCard } from "../explore/PlaceCard";
import { haversineKm, hasCoords } from "../explore/geo";
import { facilityLabel, priceLabel } from "../explore/labels";

const MiniMap = lazy(() => import("../explore/map/MiniMap").then((m) => ({ default: m.MiniMap })));

export function PlacePage() {
  const { slug } = useParams();
  const [place, setPlace] = useState<Place | null>(null);
  const [nearby, setNearby] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shareNote, setShareNote] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    Promise.all([getPlace(slug), listPublishedPlaces()])
      .then(([row, all]) => {
        if (cancelled) return;
        setPlace(row);
        document.title = `${row.name} — Explore`;
        if (hasCoords(row)) {
          const others = all
            .filter(
              (p): p is Place & { latitude: number; longitude: number } =>
                p.slug !== row.slug && p.category.id === "poi" && hasCoords(p),
            )
            .map((p) => ({
              place: p,
              km: haversineKm(row.latitude, row.longitude, p.latitude, p.longitude),
            }))
            .sort((a, b) => a.km - b.km)
            .slice(0, 5);
          setNearby(others.map((x) => x.place));
        }
      })
      .catch(() => {
        if (!cancelled) setError("That place could not be loaded.");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const mapsHref = useMemo(() => {
    if (!place || !hasCoords(place)) return null;
    return `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
  }, [place]);

  if (error) return <p className="status">{error}</p>;
  if (!place) return <p className="status">Loading…</p>;

  const price = priceLabel(place.priceBand);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, text: place.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote("Link copied.");
    } catch {
      setShareNote("Could not share from this browser.");
    }
  };

  const report = () => {
    const body = encodeURIComponent(`Place: ${place.name}\n${window.location.href}\n\nWhat's wrong:\n`);
    window.location.href = `mailto:?subject=${encodeURIComponent(`OPEN place report: ${place.name}`)}&body=${body}`;
  };

  return (
    <article className="place-page">
      <div className="hero">
        <Link className="back" to="/" aria-label="Back to Explore">
          ←
        </Link>
        {place.imageUrl ? (
          <img className="hero-photo" src={place.imageUrl} alt="" />
        ) : (
          <div className="hero-photo" aria-hidden="true" />
        )}
      </div>
      <div className="place-body">
        <h1 className="place-name">{place.name}</h1>
        <div className="chip-row">
          <span className="pill">{place.category.label}</span>
          {price ? <span className="pill">{price}</span> : null}
        </div>
        <p className="muted">
          {place.county.name}
          {place.town ? ` · ${place.town}` : ""}
        </p>
        {place.description ? <p>{place.description}</p> : null}
        {place.imageCredit ? (
          <p className="attr">
            Photo: {place.imageCredit}
            {place.imageLicence ? ` · ${place.imageLicence}` : ""} · Wikimedia Commons
          </p>
        ) : null}
        {place.website ? (
          <p>
            <a href={place.website} rel="noopener noreferrer" target="_blank">
              Website
            </a>
          </p>
        ) : null}
        {place.phone ? (
          <p>
            <a href={`tel:${place.phone}`}>{place.phone}</a>
          </p>
        ) : null}
        {place.facilities.length ? (
          <div className="chip-row" aria-label="Facilities">
            {place.facilities.map((id) => (
              <span className="chip static" key={id}>
                {facilityLabel(id)}
              </span>
            ))}
          </div>
        ) : null}
        {hasCoords(place) ? (
          <Suspense fallback={<div className="mini-map" aria-hidden="true" />}>
            <MiniMap lat={place.latitude} lng={place.longitude} />
          </Suspense>
        ) : null}
        {nearby.length ? (
          <section>
            <h2>Nearby</h2>
            <ul className="place-list nested">
              {nearby.map((row) => (
                <li key={row.id}>
                  <PlaceCard
                    place={row}
                    km={
                      hasCoords(place) && hasCoords(row)
                        ? haversineKm(place.latitude, place.longitude, row.latitude, row.longitude)
                        : null
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <p className="place-tools">
          <button className="bar-btn ghost" type="button" onClick={share}>
            Share
          </button>
          <button className="bar-btn ghost" type="button" onClick={report}>
            Report a problem
          </button>
        </p>
        {shareNote ? (
          <p className="muted" role="status">
            {shareNote}
          </p>
        ) : null}
      </div>
      {mapsHref ? (
        <div className="sticky-actions">
          <a className="primary" style={{ display: "block", textAlign: "center", padding: 12 }} href={mapsHref}>
            Directions
          </a>
        </div>
      ) : (
        <p className="status">Location not mapped yet.</p>
      )}
    </article>
  );
}
