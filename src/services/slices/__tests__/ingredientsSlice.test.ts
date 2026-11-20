import reducer, { fetchIngredients } from '../ingredientsSlice';

import type { TIngredient } from '@/utils/types';

describe('ingredientsSlice reducer', () => {
  // Дефолтное состояние которое должно возвращаться
  const initialState = {
    items: [],
    isLoading: false,
    error: null,
  };

  const mockIngredients: TIngredient[] = [
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

  it('Возвращает начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('Устанавливает isLoading в true и сбрасывает ошибку при fetchIngredients.pending', () => {
    const stateWithError = { ...initialState, error: 'Предыдущая ошибка' };

    const action = fetchIngredients.pending('requestId');
    const newState = reducer(stateWithError, action);

    expect(newState).toEqual({
      ...initialState,
      isLoading: true,
      error: null,
    });
  });

  it('Записывает данные в items и сбрасывает isLoading при fetchIngredients.fulfilled', () => {
    const loadingState = { ...initialState, isLoading: true };

    const action = fetchIngredients.fulfilled(mockIngredients, 'requestId');
    const newState = reducer(loadingState, action);

    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      items: mockIngredients,
    });
  });

  it('Записывает текст ощибки и сбрасывает isLoading при fetchIngredients.rejected', () => {
    const loadingState = { ...initialState, isLoading: true };

    const action = fetchIngredients.rejected(new Error('Ошибка сети'), 'requestId');
    const newState = reducer(loadingState, action);

    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка сети',
    });
  });

  it('Возвращает текст ошибки по умолчанию если message отсутствует', () => {
    const loadingState = { ...initialState, isLoading: true };

    const action = {
      type: fetchIngredients.rejected.type,
      error: {},
    };
    const newState = reducer(loadingState, action);

    expect(newState.error).toBe('Ошибка загрузки ингредиентов');
  });
});
