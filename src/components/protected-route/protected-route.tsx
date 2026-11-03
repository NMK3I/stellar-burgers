import { useSelector } from '@/services/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Preloader } from '../ui';

export const ProtectedRoute = (): React.JSX.Element => {
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export const OnlyUnAuthRoute = (): React.JSX.Element => {
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.auth);

  if (!isAuthChecked) {
    return <Preloader />;
  }
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
