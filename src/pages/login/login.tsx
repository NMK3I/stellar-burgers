import { loginUser, clearError } from '@/services/slices/authSlice';
import { useDispatch, useSelector } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const from =
    (location.state as { from?: { pathname?: string } })?.from?.pathname ?? '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        void navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error('Ошибка при входе:', err);
      });
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
