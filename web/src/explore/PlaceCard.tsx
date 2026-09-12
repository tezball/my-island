import { Link } from "react-router-dom";
import type { Place } from "../api/catalog";
import { formatKm } from "./geo";
import { priceLabel } from "./labels";

export function PlaceCard({
  place,
  km,
}: {
  place: Place;
  km: number | null;
}) {
  const price = priceLabel(place.priceBand);
  return (
    <Link className="place-card" to={`/places/${place.slug}`}>
      {place.imageUrl ? (
        <img className="place-photo" src={place.imageUrl} alt="" loading="lazy" />
      ) : (
        <div className="place-photo" aria-hidden="true" />
      )}
      <div className="place-meta">
        <h2 className="place-name">{place.name}</h2>
        <span className="pill">{place.category.label}</span>
        <span className="muted">
          {place.county.name}
          {place.town ? ` · ${place.town}` : ""}
          {price ? ` · ${price}` : ""}
          {km != null ? ` · ${formatKm(km)}` : ""}
        </span>
      </div>
    </Link>
  );
}
