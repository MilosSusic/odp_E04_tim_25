import { Routes, Route, Navigate } from "react-router-dom";
import { authApi } from "./api_services/auth/AuthService";
import PrijavaStranica from "./pages/auth/PrijavaStranica";
import RegistracijaStranica from "./pages/auth/RegistracijaStranica";
import { ProtectedRoute } from "./components/protectedRoute/ProtectedRoute";
import KontrolnaTablaStanaraStranica from "./pages/kontrolnaTabla/KontrolnaTablaStanarStranica";
import { faultApi } from "./api_services/kvar/KvarServis";
import KontrolnaTablaMajstorStranica from "./pages/kontrolnaTabla/KontrolnaTablaMajstorStranica";
import NotFoundPage from "./pages/notFound/NotFoundPage";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<PrijavaStranica authApi={authApi} />} />
      <Route path="/register" element={<RegistracijaStranica authApi={authApi} />} />
      <Route path="/404" element={<NotFoundPage />} />

      <Route path="/stanar-dashboard" element={
        <ProtectedRoute requiredRole="stanar">
          <KontrolnaTablaStanaraStranica faultApi={faultApi} />
        </ProtectedRoute>} />
      <Route path="/majstor-dashboard" element={
        <ProtectedRoute requiredRole="majstor">
          <KontrolnaTablaMajstorStranica faultApi={faultApi} />
        </ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
export default App;