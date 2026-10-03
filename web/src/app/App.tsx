import { Navigate, Route, Routes } from "react-router-dom";
import { ExplorePage } from "../explore/ExplorePage";
import { ListsPage } from "../explore/ListsPage";
import { PlacePage } from "../places/PlacePage";
import { GuestSessionProvider } from "../auth/guestSession";
import { ResetPage } from "../auth/ResetPage";
import { VerifyPage } from "../auth/VerifyPage";
import { AdminPage } from "../stay/AdminPage";
import { HostHome, NewStayPage } from "../stay/HostHome";
import { HostStayPage } from "../stay/HostStayPage";
import { PublicStayList, PublicStayPage } from "../stay/PublicStays";

export function App() {
  return (
    <GuestSessionProvider>
      <Routes>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/lists" element={<ListsPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/places/:slug" element={<PlacePage />} />
        <Route path="/stays" element={<PublicStayList />} />
        <Route path="/stays/:id" element={<PublicStayPage />} />
        <Route path="/host" element={<HostHome />} />
        <Route path="/host/stays/new" element={<NewStayPage />} />
        <Route path="/host/stays/:id" element={<HostStayPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </GuestSessionProvider>
  );
}
