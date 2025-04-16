import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import UserService from "../../services/UserService";

// Fetch user role from backend
const checkUserRole = async (email) => {
  try {
    const response = await UserService.getUserByEmail(email);
    if (!response) throw new Error("User not found");
    const userData = response;
    return userData.is_admin; // Returns "admin" or "user"
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};

// Higher-order component for role-based protection
const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userRole = await checkUserRole(firebaseUser.email);
        setUser(firebaseUser);
        setRole(userRole);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Admin trying to access user routes → Redirect to admin dashboard
  if (requiredRole === "user" && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // User trying to access admin routes → Redirect to homepage
  if (requiredRole === "admin" && role === "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Role-based routes
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const UserRoute = ({ children }) => (
  <ProtectedRoute requiredRole="user">{children}</ProtectedRoute>
);

// Redirect authenticated users away from login/signup
export const RedirectIfAuthenticated = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userRole = await checkUserRole(firebaseUser.email);
        setUser(firebaseUser);
        setRole(userRole);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If already logged in, redirect to respective dashboard
  if (user) {
    return <Navigate to={role === "admin" ? "/admin" : "/"} replace />;
  }

  return children;
};
