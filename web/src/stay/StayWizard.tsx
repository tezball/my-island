import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { countyFromPin, submitStay, type StayCounty } from "./api";
import { cropImage } from "./crop";
import { STAY_KINDS, WIZARD_STEPS, type StayKind } from "./kinds";
import { PinMap } from "./PinMap";

const COVER = { width: 1600, height: 900 };
const OTHER = { width: 1200, height: 800 };

export function StayWizard({ stayId }: { stayId?: string }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<StayKind>("campsite");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [cost, setCost] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [county, setCounty] = useState<StayCounty | null>(null);
  const [countyNote, setCountyNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const lat = Number(latitude);
  const lon = Number(longitude);
  const pinReady = latitude.trim() !== "" && longitude.trim() !== "" && Number.isFinite(lat) && Number.isFinite(lon);

  useEffect(() => {
    if (!pinReady) {
      setCounty(null);
      setCountyNote(null);
      return;
    }
    let cancelled = false;
    countyFromPin(lat, lon)
      .then((row) => {
        if (cancelled) return;
        setCounty(row);
        setCountyNote(row ? null : "That pin is not in one of the 32 Irish counties.");
      })
      .catch(() => {
        if (!cancelled) setCountyNote("Could not read the county from that pin.");
      });
    return () => {
      cancelled = true;
    };
  }, [lat, lon, pinReady]);

  const name = WIZARD_STEPS[step];

  const next = () => {
    setError(null);
    if (name === "title" && !title.trim()) {
      setError("Title is required.");
      return;
    }
    if (name === "description" && !description.trim()) {
      setError("Description is required.");
      return;
    }
    if (name === "images" && (files.length < 1 || files.length > 8)) {
      setError("Add at least 1 photo and at most 8.");
      return;
    }
    if (name === "location" && !county) {
      setError("Drop a pin in Ireland, or enter a latitude and longitude in one of the 32 counties.");
      return;
    }
    setStep((value) => Math.min(value + 1, WIZARD_STEPS.length - 1));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!county) {
      setError("Drop a pin in Ireland, or enter a latitude and longitude in one of the 32 counties.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("kind", kind);
      form.set("title", title.trim());
      form.set("description", description);
      if (cost.trim()) form.set("cost", cost.trim());
      if (phone.trim()) form.set("phone", phone.trim());
      if (email.trim()) form.set("email", email.trim());
      if (website.trim()) form.set("website", website.trim());
      form.set("latitude", String(lat));
      form.set("longitude", String(lon));
      for (let i = 0; i < files.length; i++) {
        const size = i === 0 ? COVER : OTHER;
        try {
          const blob = await cropImage(files[i], size.width, size.height);
          form.append("images", blob, `photo-${i}.jpg`);
        } catch {
          form.append("images", files[i]);
        }
      }
      if (stayId && files.length === 0) form.set("keepImages", "true");
      const stay = await submitStay(form, stayId);
      navigate(`/host/stays/${stay.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit this Stay");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="stay-wizard" onSubmit={onSubmit}>
      <p className="kicker">
        Step {step + 1} of {WIZARD_STEPS.length}
      </p>
      <h1 className="place-name">{name}</h1>
      {name === "kind" ? (
        <fieldset className="stay-choices">
          <legend>Kind</legend>
          {STAY_KINDS.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="kind"
                value={option}
                checked={kind === option}
                onChange={() => setKind(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
      ) : null}
      {name === "title" ? (
        <input aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      ) : null}
      {name === "description" ? (
        <textarea
          aria-label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
        />
      ) : null}
      {name === "images" ? (
        <input
          aria-label="Images"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 8))}
        />
      ) : null}
      {name === "cost" ? (
        <input
          aria-label="Cost"
          inputMode="decimal"
          placeholder="EUR"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      ) : null}
      {name === "phone" ? (
        <input aria-label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      ) : null}
      {name === "email" ? (
        <input aria-label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      ) : null}
      {name === "website" ? (
        <input aria-label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
      ) : null}
      {name === "location" ? (
        <div className="stay-location">
          <PinMap
            latitude={pinReady ? lat : null}
            longitude={pinReady ? lon : null}
            onPick={(nextLat, nextLon) => {
              setLatitude(nextLat.toFixed(6));
              setLongitude(nextLon.toFixed(6));
            }}
          />
          <label>
            Latitude
            <input
              aria-label="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label>
            Longitude
            <input
              aria-label="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <p className="muted">{county ? `County: ${county.name}` : countyNote}</p>
        </div>
      ) : null}
      {error ? <p className="status">{error}</p> : null}
      <div className="stay-actions">
        {step > 0 ? (
          <button type="button" className="bar-btn ghost" onClick={() => setStep((value) => value - 1)}>
            Back
          </button>
        ) : null}
        {step < WIZARD_STEPS.length - 1 ? (
          <button type="button" className="primary" onClick={next}>
            Next
          </button>
        ) : (
          <button type="submit" className="primary" disabled={busy}>
            {busy ? "Submitting…" : "Submit Stay"}
          </button>
        )}
      </div>
    </form>
  );
}
