import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext.jsx";
import CreateTripPage from "./pages/CreateTripPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import MyParticipationsPage from "./pages/MyParticipationsPage";
import UserProfilePage from "./pages/UserProfilePage";
import EditTripPage from "./pages/EditTripPage.jsx";
import AdminPage from "./components/admin/AdminPage.jsx";
import TravelStatistics from "./components/TravelStatistics.jsx";
import ActivateAccountPage from "./pages/ActivateAccountPage";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/create-trip"
            element={
              <PrivateRoute>
                <CreateTripPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <PrivateRoute>
                <TripDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-participations"
            element={
              <PrivateRoute>
                <MyParticipationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/trips/:id/edit"
            element={
              <PrivateRoute>
                <EditTripPage />
              </PrivateRoute>
            }
          />
          <Route path="/activate" element={<ActivateAccountPage />} />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route 
          path="/travel-statistics/:participationId" 
          element={
          <TravelStatistics />
          } 
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
