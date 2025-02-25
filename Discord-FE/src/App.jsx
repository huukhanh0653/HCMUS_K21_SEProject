import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Authentication/Login';
import Signup from './pages/Authentication/Signup';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import Footer from './components/Footer';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
