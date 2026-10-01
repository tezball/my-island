import { Link } from "react-router-dom";
import { GuestAuth } from "../auth/GoogleLogin";
import { useGuestSession } from "../auth/guestSession";

export function AppHeader({
  title,
  onSearch,
  onAccount,
}: {
  title: string;
  onSearch?: () => void;
  onAccount: () => void;
}) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="ms accent" aria-hidden="true">
          explore
        </span>
        <h1 className="wordmark">{title}</h1>
      </div>
      <div className="header-actions">
        {onSearch ? (
          <button type="button" className="icon-btn" aria-label="Search locations" onClick={onSearch}>
            <span className="ms">search</span>
          </button>
        ) : null}
        <Link className="icon-btn" to="/lists" aria-label="Saved spots">
          <span className="ms">bookmark</span>
        </Link>
        <button type="button" className="avatar" aria-label="Profile" onClick={onAccount}>
          <span className="ms">person</span>
        </button>
      </div>
    </header>
  );
}

export function BottomNav({
  active,
  onAccount,
}: {
  active: "explore" | "map" | "saved";
  onAccount: () => void;
}) {
  return (
    <nav className="bottom-bar" aria-label="Primary">
      <Link
        className={active === "explore" ? "tab is-active" : "tab"}
        to="/"
        aria-current={active === "explore" ? "page" : undefined}
      >
        <span className="ms">explore</span>
        <span>Explore</span>
      </Link>
      <Link
        className={active === "map" ? "tab is-active" : "tab"}
        to="/?view=map"
        aria-current={active === "map" ? "page" : undefined}
      >
        <span className="ms">map</span>
        <span>Map</span>
      </Link>
      <Link
        className={active === "saved" ? "tab is-active" : "tab"}
        to="/lists"
        aria-current={active === "saved" ? "page" : undefined}
      >
        <span className="ms">bookmark</span>
        <span>Saved</span>
      </Link>
      <button type="button" className="tab" onClick={onAccount}>
        <span className="ms">person</span>
        <span>Profile</span>
      </button>
    </nav>
  );
}

export function AccountSheet({ onClose }: { onClose: () => void }) {
  const { me, setMe } = useGuestSession();
  return (
    <>
      <button className="backdrop" aria-label="Close profile" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <h2 id="account-title" className="place-name">
          Profile
        </h2>
        <GuestAuth me={me} onMe={setMe} />
      </div>
    </>
  );
}
