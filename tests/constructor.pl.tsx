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

    // refreshToken кладем в localStorage до загрузки страницы
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh');
    });

    // Юзаем HAR
    await page.routeFromHAR('tests/hars/api.har', {
      url: '**/api/**',
      update: false,
    });

    // Переходим на страницу
    await page.goto('/');

    // Делаем скрин главной страницы (закомментировал)
    // await page.screenshot({ path: 'tests/test-screen.png' });

    // Ждем загрузки ингредиентов
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  });

  test('Добавление ингредиентов в конструктор', async ({ page }) => {
    // Находим карточку конкретной булки и кликаем добавить
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    // Проверяем что булка появилась сверху и снизу
    await expect(page.getByText('(верх)')).toBeVisible();
    await expect(page.getByText('(низ)')).toBeVisible();

    // Делаем скрин наличия булок (закомментировал)
    // await page.screenshot({ path: 'tests/test-screen-bun.png' });

    // Добавляем начинку и кликаем добавить
    const mainCard = page
      .locator('li')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' });
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    // Проверяем что начинка добавилась
    await expect(page.getByText('Выберите начинку')).toBeHidden();

    // Делаем скрин наличия начинки (закомментировал)
    // await page.screenshot({ path: 'tests/test-screen-main.png' });
  });

  test('Работа модальных окон ингредиента', async ({ page }) => {
    // Открываем модалку кликом по картинке
    const bunCard = page
      .locator('li')
      .filter({ hasText: 'Говяжий метеорит (отбивная)' });
    const modal = page.locator('#modals');

    // Открываем модалку, проверяем что она открылась и проверяем что в модалке отображается название нужного ингредиента
    await bunCard.locator('a[href^="/ingredients/"]').click();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByText('Говяжий метеорит (отбивная)')).toBeVisible();

    // Делаем скрин открытия модалки (закомментировал)
    // await page.screenshot({ path: 'tests/test-screen-modal-open.png' });

    // Закрываем по крестику
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeHidden();

    // Делаем скрин закрытия модалки по крестику (закомментировал)
    // await page.screenshot({ path: 'tests/test-screen-modal-close-smallcross.png' });

    // Снова открываем и закрываем по оверлею
    await bunCard.locator('a[href^="/ingredients/"]').click();
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    // Клик по оверлею слева сверху
    await page.mouse.click(10, 10);
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeHidden();

    // Делаем скрин закрытия модалки по оверлею (закомментировал)
    // await page.screenshot({ path: 'tests/test-screen-modal-close-overlay.png' });
  });

  test('Создание заказа', async ({ page }) => {
    // Собираем бургер-мургер-крюгер
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

    // Кликаем по кнопке оформить заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Проверяем что модалка открылась и номер заказа верный
    const orderModal = page.locator('#modals');
    await expect(orderModal.getByRole('heading', { name: '1186' })).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    // Делаем скрин открытия модалки при оформлении заказа (закомментировал)
    // await page.screenshot({ path: 'tests/test-screen-modal-order.png' });

    // Проверяем что конструктор пуст
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    // Закрываем модалку и проверяем успешность закрытия
    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(orderModal.getByRole('heading', { name: '1186' })).toBeHidden();
  });
});
