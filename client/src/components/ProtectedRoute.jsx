import { Navigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
