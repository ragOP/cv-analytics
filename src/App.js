import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import SingleWebsiteAnalytics from "./pages/SingleWebsiteAnalytics";
import { ToastContainer } from "@cred/neopop-web/lib/components";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/single-analytics" element={<SingleWebsiteAnalytics />} />
      </Routes>
    </Router>
    <ToastContainer />
  </>
  );
}

export default App;
