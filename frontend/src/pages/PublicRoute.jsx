import { Navigate } from "react-router-dom";

/**
 * Redirects already-logged-in users away from public-only pages
 * like /login and /register, to their appropriate dashboard.
 */
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (token && user) {
    return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  }

  return children;
};

export default PublicRoute;
