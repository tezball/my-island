import { Navigate, Route, Routes } from "react-router-dom";
import { ExplorePage } from "../explore/ExplorePage";
import { ListsPage } from "../explore/ListsPage";
import { PlacePage } from "../places/PlacePage";
import { GuestSessionProvider } from "../auth/guestSession";

export function App() {
  return (
    <GuestSessionProvider>
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/lists" element={<ListsPage />} />
        <Route path="/places/:slug" element={<PlacePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GuestSessionProvider>
  );
}
