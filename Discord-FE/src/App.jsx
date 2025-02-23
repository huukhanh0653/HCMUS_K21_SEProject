import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Footer from './components/Footer';


import AdminLayout from './admin/layout/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard/Dashboard';
import UsersManagement from './admin/pages/Users_Management/UsersManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <h1 className="text-2xl font-bold text-blue-500">Hello World</h1>
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Login />
              <Footer />
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <Signup />
              <Footer />
            </>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <>
              <ForgotPassword />
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/">
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users-management" element={<UsersManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
