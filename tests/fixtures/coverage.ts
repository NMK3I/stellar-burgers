import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import { test as base, expect } from '@playwright/test';
import v8toIstanbul from 'v8-to-istanbul';

const coverageDir = path.resolve(process.cwd(), '.nyc_output');

// Расширяем тест Playwright
export const test = base.extend({
  page: async ({ page, browserName }, use) => {
    if (browserName === 'chromium') {
      await page.coverage.startJSCoverage({ resetOnNavigation: false });
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);

    if (browserName === 'chromium') {
      const coverage = await page.coverage.stopJSCoverage();

      // Фильтруем код только своего приложения и исключаем node_modules и т.д.
      const appCoverage = coverage.filter(
        (entry) =>
          entry.url.includes('localhost:4000') && !entry.url.includes('node_modules')
      );

      if (appCoverage.length > 0) {
        fs.mkdirSync(coverageDir, { recursive: true });

        const istanbulCoverage: Record<string, unknown> = {};

        // Конвертируем в Istanbul формат
        for (const entry of appCoverage) {
          try {
            const converter = v8toIstanbul(entry.url, 0, { source: entry.source ?? '' });
            await converter.load();
            converter.applyCoverage(entry.functions);
            // Мержим
            Object.assign(istanbulCoverage, converter.toIstanbul());
          } catch (e) {
            console.warn(`Не удалось конвертировать ${entry.url}`, e);
          }
        }

        const coverageFile = path.join(
          coverageDir,
          `coverage-${crypto.randomUUID()}.json`
        );
        fs.writeFileSync(coverageFile, JSON.stringify(istanbulCoverage));
      }
    }
  },
});

export { expect };
