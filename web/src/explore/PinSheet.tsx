import { Link } from "react-router-dom";
import type { Place } from "../api/catalog";

export function PinSheet({ place, onClose }: { place: Place; onClose: () => void }) {
  return (
    <>
      <button className="backdrop" aria-label="Close place" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="pin-title">
        {place.imageUrl ? (
          <img className="hero-photo" src={place.imageUrl} alt="" />
        ) : (
          <div className="hero-photo" aria-hidden="true" />
        )}
        <h2 id="pin-title" className="place-name">
          {place.name}
        </h2>
        <p className="muted">
          {place.category.label} · {place.county.name}
          {place.town ? ` · ${place.town}` : ""}
        </p>
        {place.description ? <p>{place.description}</p> : null}
        <p>
          <Link className="primary" style={{ display: "inline-block", padding: "12px 20px" }} to={`/places/${place.slug}`}>
            Open place
          </Link>
        </p>
      </div>
    </>
  );
}
