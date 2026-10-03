import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGuestSession } from "../auth/guestSession";
import {
  listAdminStays,
  listBans,
  listStuckStays,
  runReviewAgain,
  unban,
  type BannedAccount,
  type Stay,
} from "./api";

export function AdminPage() {
  const { me } = useGuestSession();
  const [stays, setStays] = useState<Stay[]>([]);
  const [stuck, setStuck] = useState<Stay[]>([]);
  const [bans, setBans] = useState<BannedAccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    Promise.all([listAdminStays(), listStuckStays(), listBans()])
      .then(([all, waiting, banned]) => {
        setStays(all);
        setStuck(waiting);
        setBans(banned);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not open the admin console"));
  };

  useEffect(() => {
    document.title = "Admin";
    if (me) load();
  }, [me]);

  return (
    <main className="stay-page">
      <Link to="/">Explore</Link>
      <h1 className="place-name">Admin</h1>
      {error ? <p className="status">{error}</p> : null}
      <section>
        <h2>All Stays</h2>
        <ul className="place-list">
          {stays.map((stay) => (
            <li key={stay.id}>
              <span>
                {stay.title} · {stay.kind} · {stay.status}
                {stay.hostUsername ? ` · ${stay.hostUsername}` : ""}
              </span>
              <button type="button" className="bar-btn ghost" onClick={() => runReviewAgain(stay.id).then(load)}>
                Run review again
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Stays stuck in review</h2>
        <ul className="place-list">
          {stuck.map((stay) => (
            <li key={stay.id}>
              {stay.title} · submitted
              <button type="button" className="bar-btn ghost" onClick={() => runReviewAgain(stay.id).then(load)}>
                Run review again
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Banned accounts</h2>
        <ul className="place-list">
          {bans.map((account) => (
            <li key={account.userId}>
              <span>
                {account.username} · {account.banReason}
              </span>
              <button type="button" className="bar-btn ghost" onClick={() => unban(account.userId).then(load)}>
                Unban
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
