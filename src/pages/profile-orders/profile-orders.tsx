import { fetchProfileOrders } from '@/services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { orders, isLoading } = useSelector((state) => state.profileOrders);

  useEffect(() => {
    void dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
