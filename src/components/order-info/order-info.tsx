import { fetchOrderByNumber, clearOrderState } from '@/services/slices/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.items);

  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);

  const { currentOrder, isOrderLoading, orderError } = useSelector(
    (state) => state.feed
  );

  const orderFromStore =
    feedOrders.find((o) => o.number === Number(number)) ??
    profileOrders.find((o) => o.number === Number(number));

  useEffect(() => {
    if (!orderFromStore && number && !currentOrder && !isOrderLoading && !orderError) {
      void dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [orderFromStore, number, currentOrder, isOrderLoading, orderError, dispatch]);

  useEffect(() => {
    return (): void => {
      dispatch(clearOrderState());
    };
  }, [dispatch, number]);

  const orderData = orderFromStore ?? currentOrder;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (isOrderLoading) {
    return <Preloader />;
  }

  if (orderError) {
    return (
      <p className="text text_type_main-default mt-10">
        Ошибка загрузки заказа: {orderError}
      </p>
    );
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
