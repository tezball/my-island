import { Link } from "react-router-dom";
import type { Place } from "../api/catalog";
import { useGuestSession } from "../auth/guestSession";
import { formatKm } from "./geo";
import { priceLabel } from "./labels";
import { VisitTicks } from "./VisitTicks";

export function PlaceCard({
  place,
  km,
}: {
  place: Place;
  km: number | null;
}) {
  const { me, marks, setMark } = useGuestSession();
  const price = priceLabel(place.priceBand);
  const paid = Boolean(place.priceBand && place.priceBand !== "FREE");
  const where = place.town || place.category.label;
  const countyLine = `CO. ${place.county.name.toUpperCase()}${
    place.town ? ` · ${place.town.toUpperCase()}` : ""
  }`;

  return (
    <article className="place-card">
      <div className="card-row">
        <Link className="card-photo" to={`/places/${place.slug}`} tabIndex={-1} aria-hidden="true">
          {place.imageUrl ? (
            <img src={place.imageUrl} alt="" loading="lazy" />
          ) : (
            <span className="photo-miss" />
          )}
          {price ? <span className={paid ? "photo-badge warn" : "photo-badge"}>{price}</span> : null}
        </Link>
        <div className="card-copy">
          <div className="card-top">
            <span className="county-badge">{countyLine}</span>
          </div>
          <h2 className="place-name">
            <Link to={`/places/${place.slug}`}>{place.name}</Link>
          </h2>
          <p className="card-where">
            <span className="ms">location_on</span>
            <span>{where}</span>
          </p>
          <div className="card-foot">
            <span className={paid ? "card-status warn" : "card-status"}>
              <span className="status-dot" aria-hidden="true" />
              {price ? price : place.category.label}
              {km != null ? ` · ${formatKm(km)}` : ""}
              {` · ${place.visitedCount} visited`}
            </span>
            <Link className="view-link" to="/?view=map">
              View map
              <span className="ms">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
      <VisitTicks placeId={place.id} me={me} mark={marks[place.id]} onMark={setMark} />
    </article>
  );
}
