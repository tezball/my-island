import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchMe, type Me } from "../api/auth";
import {
  listMyVisitIntents,
  marksByPlace,
  type VisitMark,
} from "../api/visitIntent";

type Ctx = {
  me: Me | null;
  setMe: (me: Me | null) => void;
  marks: Record<string, VisitMark>;
  setMark: (placeId: string, mark: VisitMark | undefined) => void;
};

const GuestSessionContext = createContext<Ctx | null>(null);

export function GuestSessionProvider({ children }: { children: ReactNode }) {
  const [me, setMeState] = useState<Me | null>(null);
  const [marks, setMarks] = useState<Record<string, VisitMark>>({});

  useEffect(() => {
    let cancelled = false;
    fetchMe()
      .then((profile) => {
        if (!cancelled) setMeState(profile);
      })
      .catch(() => {
        if (!cancelled) setMeState(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setMe = useCallback((next: Me | null) => {
    setMeState(next);
    if (!next) setMarks({});
  }, []);

  useEffect(() => {
    if (!me) return;
    let cancelled = false;
    listMyVisitIntents()
      .then((rows) => {
        if (!cancelled) setMarks(marksByPlace(rows));
      })
      .catch(() => {
        if (!cancelled) setMarks({});
      });
    return () => {
      cancelled = true;
    };
  }, [me]);

  const setMark = useCallback((placeId: string, mark: VisitMark | undefined) => {
    setMarks((prev) => {
      const next = { ...prev };
      if (!mark) delete next[placeId];
      else next[placeId] = mark;
      return next;
    });
  }, []);

  const value = useMemo(() => ({ me, setMe, marks, setMark }), [me, setMe, marks, setMark]);
  return <GuestSessionContext.Provider value={value}>{children}</GuestSessionContext.Provider>;
}

export function useGuestSession(): Ctx {
  const ctx = useContext(GuestSessionContext);
  if (!ctx) throw new Error("useGuestSession");
  return ctx;
}
