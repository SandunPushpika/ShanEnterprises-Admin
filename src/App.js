import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import DashboardLayout from './pages/DashboardLayout';
import Main from './pages/Main';
import DriverPage from './pages/DriversPage';
import VehiclePage from './pages/VehiclePage';
import CustomersPage from './pages/CustomersPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "register" element = {<RegisterPage />} />
        <Route path = "login" element = {<LoginPage />} />
        <Route path="/" element={<DashboardLayout />} >
          <Route index element={<Main />} />
          <Route path="vehicles" element={<VehiclePage />} />
          <Route path="drivers" element={<DriverPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="bookings" element={<BookingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
