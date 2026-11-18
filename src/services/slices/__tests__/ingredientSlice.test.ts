import reducer, { fetchIngredients } from '../ingredientsSlice';

import type { TIngredient } from '@/utils/types';

describe('ingredientsSlice reducer', () => {
  // Дефолтное состояние которое должно возвращаться
  const initialState = {
    items: [],
    isLoading: false,
    error: null,
  };

  const mockIngredietns: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка-Хрумка',
      type: 'bun',
      proteins: 1000,
      fat: 1000,
      carbohydrates: 1000,
      calories: 1500,
      price: 10000,
      image: 'img',
      image_mobile: 'img',
      image_large: 'img',
    },
  ];

  it('Должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('Должен обработать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      isLoading: true,
      error: null,
    });
  });

  it('Должен обработать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredietns,
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      items: mockIngredietns,
    });
  });

  it('Должен обработать fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' },
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка сети',
    });
  });

  it('Должен вернуть текст ошибки по дефолту если message отсутствует', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: {},
    };

    const newState = reducer(initialState, action);

    expect(newState.error).toBe('Ошибка загрузки ингредиентов');
  });
});
