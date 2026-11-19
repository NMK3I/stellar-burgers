import { test, expect } from './fixtures/coverage';

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page, context }) => {
    // Мокаем токены авторизации
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mock-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    // refreshToken кладем в localStorage до загрузки страницы, чтобы приложение сразу видело авторизацию
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh');
    });

    await page.routeFromHAR('tests/hars/api.har', {
      url: '**/api/**',
      update: false,
    });

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  });

  test.describe('Добавление ингредиентов в конструктор', () => {
    test('Должен добавить булку и начинку в конструктор', async ({ page }) => {
      const constructorArea = page
        .locator('section')
        .filter({ hasText: 'Оформить заказ' });

      // Проверяем до клика что ингредиентов в конструкторе нет
      await expect(constructorArea.getByText('Краторная булка N-200i')).toBeHidden();
      await expect(
        constructorArea.getByText('Говяжий метеорит (отбивная)')
      ).toBeHidden();

      const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
      await bunCard.getByRole('button', { name: 'Добавить' }).click();

      await expect(
        constructorArea.getByText('Краторная булка N-200i (верх)')
      ).toBeVisible();
      await expect(
        constructorArea.getByText('Краторная булка N-200i (низ)')
      ).toBeVisible();

      const mainCard = page
        .locator('li')
        .filter({ hasText: 'Говяжий метеорит (отбивная)' });
      await mainCard.getByRole('button', { name: 'Добавить' }).click();

      await expect(
        constructorArea.getByText('Говяжий метеорит (отбивная)')
      ).toBeVisible();
    });
  });

  test.describe('Работа модальных окон ингредиента', () => {
    test('Должен открывать и закрывать модалку по крестику и оверлею, проверять ее отсутствие и наличие нужного ингредиента ', async ({
      page,
    }) => {
      const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
      const modal = page.locator('#modals');
      const modalHeading = modal.getByRole('heading', { name: 'Детали ингредиента' });

      await expect(modalHeading).toBeHidden();

      await bunCard.locator('a[href^="/ingredients/"]').click();
      await expect(modalHeading).toBeVisible();
      await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();

      await page.getByRole('button', { name: 'Закрыть' }).click();
      await expect(modalHeading).toBeHidden();

      await bunCard.locator('a[href^="/ingredients/"]').click();
      await expect(modalHeading).toBeVisible();

      await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
      await expect(modalHeading).toBeHidden();
    });
  });

  test.describe('Создание заказа', () => {
    test('Должен успешно имитировать создание заказа и очищать конструктор', async ({
      page,
    }) => {
      const constructorArea = page
        .locator('section')
        .filter({ hasText: 'Оформить заказ' });
      const orderModal = page.locator('#modals');
      const orderHeading = orderModal.getByRole('heading', { name: '1186' });

      await page
        .locator('li')
        .filter({ hasText: 'Краторная булка N-200i' })
        .getByRole('button', { name: 'Добавить' })
        .click();
      await page
        .locator('li')
        .filter({ hasText: 'Говяжий метеорит (отбивная)' })
        .getByRole('button', { name: 'Добавить' })
        .click();

      await expect(
        constructorArea.getByText('Краторная булка N-200i (верх)')
      ).toBeVisible();
      await expect(
        constructorArea.getByText('Говяжий метеорит (отбивная)')
      ).toBeVisible();
      await expect(
        constructorArea.getByText('Краторная булка N-200i (низ)')
      ).toBeVisible();

      await expect(orderHeading).toBeHidden();

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      await expect(orderHeading).toBeVisible();
      await expect(page.getByText('идентификатор заказа')).toBeVisible();

      await expect(constructorArea.getByText('Выберите булки')).toHaveCount(2);
      await expect(constructorArea.getByText('Выберите начинку')).toBeVisible();

      await page.getByRole('button', { name: 'Закрыть' }).click();
      await expect(orderHeading).toBeHidden();
    });
  });
});
