import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../constructorSlice';

import type { TIngredient, TConstructorIngredient } from '@/utils/types';

// Мокаем crypto.random
const mockUUID = 'mock-uuid-six-seven';
Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: () => mockUUID },
});

describe('constructorSlice reducer', () => {
  const initialState = {
    bun: null,
    ingredients: [],
  };

  const mockBun: TIngredient = {
    _id: '1',
    name: 'Булка-Хрумка',
    type: 'bun',
    price: 10000,
    image: 'img',
    image_mobile: 'img',
    image_large: 'img',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
  };

  const mockMain: TIngredient = {
    _id: '2',
    name: 'Начинка-Малинка',
    type: 'main',
    price: 20000,
    image: 'img',
    image_mobile: 'img',
    image_large: 'img',
    proteins: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0,
  };

  it('Должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('Должен обработать addIngredient (добавление булки)', () => {
    const action = addIngredient(mockBun);
    const newState = reducer(initialState, action);

    expect(newState.bun).toEqual({ ...mockBun, id: mockUUID });
    expect(newState.ingredients).toEqual([]);
  });

  it('Должен обработать addIngredient (добавление начинки)', () => {
    const action = addIngredient(mockMain);
    const newState = reducer(initialState, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toEqual([{ ...mockMain, id: mockUUID }]);
  });

  it('Должен обработать removeIngredient', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [{ ...mockMain, id: mockUUID }] as TConstructorIngredient[],
    };

    const action = removeIngredient(mockUUID);
    const newState = reducer(stateWithIngredient, action);

    expect(newState.ingredients).toEqual([]);
  });

  it('Должен обработать moveIngredient (перемещение ингредиентов)', () => {
    const stateWithTwoIngredients = {
      bun: null,
      ingredients: [
        { ...mockMain, id: 'id-1', name: 'Первый' },
        { ...mockMain, id: 'id-2', name: 'Второй' },
      ] as TConstructorIngredient[],
    };

    // Меняем местами
    const action = moveIngredient({ from: 0, to: 1 });
    const newState = reducer(stateWithTwoIngredients, action);

    expect(newState.ingredients[0].name).toBe('Второй');
    expect(newState.ingredients[1].name).toBe('Первый');
  });

  it('НЕ должен перемещать ингредиенты если индекс выходит за пределы массива', () => {
    const stateWithIngredietns = {
      bun: null,
      ingredients: [{ ...mockMain, id: 'id-1' }] as TConstructorIngredient[],
    };

    // Попытка переместить элемент
    const action = moveIngredient({ from: 0, to: 5 });
    const newState = reducer(stateWithIngredietns, action);

    expect(newState).toEqual(stateWithIngredietns);
  });

  it('Должен обработать clearConstructor', () => {
    const stateWithItems = {
      bun: { ...mockBun, id: mockUUID },
      ingredients: [{ ...mockMain, id: 'id-1' }] as TConstructorIngredient[],
    };

    const action = clearConstructor();
    const newState = reducer(stateWithItems, action);

    expect(newState).toEqual(initialState);
  });
});
