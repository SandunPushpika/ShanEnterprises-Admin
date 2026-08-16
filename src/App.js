import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from './pages/DashboardLayout';
import Main from './pages/Main';
import DriverPage from './pages/DriversPage';
import VehiclePage from './pages/VehiclePage';
import CustomersPage from './pages/CustomersPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './auth/ProtectedRoute';
import AuthProvider from './context/AuthProvider';
import DriversPage from "./pages/DriversPage";
import VehicleMaintenancePage from './pages/VehicleMaintenancePage';
import ContactRequestsPage from './pages/ContactRequestsPage';
import DriverTripsAdminPage from './pages/DriverTripsAdminPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Main />} />
              <Route path="drivers" element={<DriverPage />} />
              <Route path="vehicles" element={<VehiclePage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="bookings" element={<BookingPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/drivers/:driverId/trips" element={<DriverTripsAdminPage />} />
              <Route path="/contact-requests" element={<ContactRequestsPage />} />
              <Route path="/vehicle-maintenance" element={<VehicleMaintenancePage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
