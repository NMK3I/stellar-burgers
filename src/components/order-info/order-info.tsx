import { useSelector } from '@/services/store';
import { getOrderByNumberApi } from '@/utils/burger-api';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient, TOrder } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  const ingredients = useSelector((state) => state.ingredients.items);

  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.profileOrders.orders);

  const orderFromStore =
    feedOrders.find((o) => o.number === Number(number)) ??
    profileOrders.find((o) => o.number === Number(number));

  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    if (!orderFromStore && number && !fetchedOrder) {
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.success && res.orders.length > 0) {
            setFetchedOrder(res.orders[0]);
          }
        })
        .catch((err) => console.error('Ошибка загрузки заказа:', err));
    }
  }, [number, orderFromStore, fetchedOrder]);

  const orderData = orderFromStore ?? fetchedOrder;

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

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
