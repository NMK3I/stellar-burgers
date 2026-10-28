import { Preloader } from '@/components/ui';
import { updateUser } from '@/services/slices/authSlice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
      });
      setIsInitialized(true);
    }
  }, [user]);

  if (!user) {
    return <Preloader />;
  }

  const isFormChanged =
    isInitialized &&
    (formValue.name !== (user.name ?? '') ||
      formValue.email !== (user.email ?? '') ||
      !!formValue.password);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(updateUser(formValue))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch((err) => {
        console.error('Ошибка при обновлении профиля:', err);
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value || '',
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error ?? ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
