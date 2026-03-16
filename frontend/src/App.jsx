import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </div>
  );
}