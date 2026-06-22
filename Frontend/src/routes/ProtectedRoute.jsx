import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
function ProtectedRoute({ children, allowedRoles }) {
const { user } = useContext(AuthContext);
if (!user) {
return <Navigate to="/" />;
}
if (allowedRoles && !allowedRoles.includes(user.role)) {
// STAFF has no dashboard access, so send them somewhere they CAN see
const fallback = user.role === "STAFF" ? "/products" : "/dashboard";
return <Navigate to={fallback} />;
}
return children;
}
export default ProtectedRoute;