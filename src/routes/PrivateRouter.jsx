import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRouter({ children, allowedRoles }) {
  const { auth } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check authentication
  if (!auth?.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check authorization if allowedRoles is provided
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRouter;