import { Navigate, Route, Routes } from "react-router-dom";
import { ExplorePage } from "../explore/ExplorePage";
import { PlacePage } from "../places/PlacePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ExplorePage />} />
      <Route path="/places/:slug" element={<PlacePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
