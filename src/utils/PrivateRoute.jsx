import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom" 


const PrivateRoute = ({ children }) => {
  const isAuthen = useSelector((state) => state.user.isauthentic);

  if (isAuthen === undefined) return null;

  return isAuthen ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute