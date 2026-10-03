import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { eur, getPublicStay, listPublicStays, type Stay } from "./api";

export function PublicStayList() {
  const [stays, setStays] = useState<Stay[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Stays";
    listPublicStays()
      .then(setStays)
      .catch(() => setError("Could not load Stays."));
  }, []);

  return (
    <main className="stay-page" id="public-stays">
      <Link to="/">Explore</Link>
      <h1 className="place-name">Stays</h1>
      {error ? <p className="status">{error}</p> : null}
      {stays && stays.length === 0 ? <p className="muted">No public Stays yet.</p> : null}
      <ul className="place-list">
        {(stays ?? []).map((stay) => (
          <li key={stay.id}>
            <Link to={`/stays/${stay.id}`}>
              {stay.title} · {stay.kind}
              {stay.county ? ` · ${stay.county.name}` : ""}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export function PublicStayPage() {
  const { id } = useParams();
  const [stay, setStay] = useState<Stay | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getPublicStay(id)
      .then((row) => {
        setStay(row);
        document.title = `${row.title} — Stay`;
      })
      .catch(() => setError("That Stay is not public."));
  }, [id]);

  if (error) {
    return (
      <main className="stay-page">
        <p className="status">{error}</p>
      </main>
    );
  }
  if (!stay) return <p className="status">Loading…</p>;
  const price = eur(stay.cost);

  return (
    <main className="stay-page">
      <Link to="/stays">Stays</Link>
      <h1 className="place-name">{stay.title}</h1>
      <p>{stay.kind}</p>
      {stay.county ? <p>County: {stay.county.name}</p> : null}
      {stay.imageCount > 0 ? (
        <img src={`/api/v1/stays/${stay.id}/images/0`} alt="" />
      ) : null}
      <p className="stay-description">{stay.description}</p>
      {price ? <p>{price}</p> : null}
      {stay.phone ? <p>Phone: {stay.phone}</p> : null}
      {stay.email ? <p>Email: {stay.email}</p> : null}
      {stay.website ? (
        <p>
          <a href={stay.website}>{stay.website}</a>
        </p>
      ) : null}
    </main>
  );
}
