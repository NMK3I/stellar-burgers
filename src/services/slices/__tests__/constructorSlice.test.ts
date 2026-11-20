import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../constructorSlice';

import type { TIngredient, TConstructorIngredient } from '@/utils/types';

// Мокаем crypto.random
const mockUUID = 'mock-uuid-six-seven';
Object.defineProperty(globalThis.crypto, 'randomUUID', {
  value: jest.fn(() => mockUUID),
  configurable: true,
});

// Очищаем моки после теста
afterEach(() => {
  jest.restoreAllMocks();
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

  it('Возвращает начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('Кладет булку в поле bun и не меняет массив ingredients при обработке addIngredient', () => {
    const action = addIngredient(mockBun);
    const newState = reducer(initialState, action);

    expect(newState.bun).toEqual({ ...mockBun, id: mockUUID });
    expect(newState.ingredients).toEqual([]);
  });

  it('Добавляет начинку в конец массива ingredients, не затрагивая существующие', () => {
    const existingIngredient = {
      ...mockMain,
      id: 'existing-id',
      name: 'Старая начинка',
    };
    const stateWithOneIngredient = {
      bun: null,
      ingredients: [existingIngredient] as TConstructorIngredient[],
    };

    const action = addIngredient(mockMain);
    const newState = reducer(stateWithOneIngredient, action);

    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(2);
    expect(newState.ingredients[0]).toEqual(existingIngredient);
    expect(newState.ingredients[1]).toEqual({ ...mockMain, id: mockUUID });
  });

  it('Удаляет только один ингредиент из массива с переданным id, оставляя остальные', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockMain, id: 'id-1', name: 'Первый' },
        { ...mockMain, id: 'id-2', name: 'Второй' },
      ] as TConstructorIngredient[],
    };

    const action = removeIngredient('id-1');
    const newState = reducer(stateWithIngredients, action);

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0].id).toBe('id-2');
    expect(newState.ingredients[0].name).toBe('Второй');
  });

  it('Меняет порядок ингредиентов в массиве согласно переданным индексам при обработке moveIngredient', () => {
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

    // Проверяем имена по индексам
    expect(newState.ingredients[0].name).toBe('Второй');
    expect(newState.ingredients[1].name).toBe('Первый');
  });

  it('НЕ должен перемещать ингредиенты если индекс выходит за пределы массива', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...mockMain, id: 'id-1', name: 'Первый' },
        { ...mockMain, id: 'id-2', name: 'Второй' },
      ] as TConstructorIngredient[],
    };

    // Попытка переместить элемент
    const action = moveIngredient({ from: 0, to: 5 });
    const newState = reducer(stateWithIngredients, action);

    // Проверяем что состояние не изменилось
    expect(newState).toEqual(stateWithIngredients);

    // Проверяем имена по индексам
    expect(newState.ingredients[0].name).toBe('Первый');
    expect(newState.ingredients[1].name).toBe('Второй');
  });

  it('Сбрасывает поле bun в null и очищает массив ingredients при обработке clearConstructor', () => {
    const stateWithItems = {
      bun: { ...mockBun, id: mockUUID },
      ingredients: [{ ...mockMain, id: 'id-1' }] as TConstructorIngredient[],
    };

    const action = clearConstructor();
    const newState = reducer(stateWithItems, action);

    expect(newState).toEqual(initialState);
  });
});
