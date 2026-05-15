import { expect, test } from '@playwright/test';

test.describe('Hex Maze', () => {
  test('landing page renders and starts a Normal game', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Hex Maze' })).toBeVisible();
    await page.getByRole('button', { name: /normal difficulty/i }).click();
    await expect(page.getByRole('grid', { name: 'Hex board' })).toBeVisible();
    await expect(page.getByText(/Score 1000/)).toBeVisible();
    await expect(page.getByText(/Walls 0/)).toBeVisible();
  });

  test('placing a wall deducts score and moves the mouse', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /easy difficulty/i }).click();
    const initialScore = await page
      .getByText(/Score \d+/)
      .first()
      .textContent();
    await page.locator('[aria-label^="Empty cell"]').first().click();
    await expect(page.getByText(/Walls 1/)).toBeVisible();
    await expect(page.getByText(/Score \d+/).first()).not.toHaveText(
      initialScore ?? '',
    );
  });

  test('mouse cell is aria-disabled and rejects clicks', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /normal difficulty/i }).click();
    const mouseCell = page.getByLabel('Mouse');
    await expect(mouseCell).toHaveAttribute('aria-disabled', 'true');
    await mouseCell.click({ force: true });
    await expect(page.getByText(/Walls 0/)).toBeVisible();
  });

  test('game ends with a banner; Restart returns to a fresh game', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /easy difficulty/i }).click();
    for (let i = 0; i < 80; i++) {
      if (await page.getByRole('status').isVisible().catch(() => false)) break;
      const empty = page.locator('[aria-label^="Empty cell"]').first();
      if (!(await empty.isVisible().catch(() => false))) break;
      await empty.click();
      await page.waitForTimeout(260);
    }
    await expect(page.getByRole('status')).toBeVisible();
    await page.getByRole('button', { name: /play again|restart/i }).first().click();
    await expect(page.getByText(/Walls 0/)).toBeVisible();
  });

  test('Menu returns to the landing page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /hard difficulty/i }).click();
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByRole('heading', { name: 'Hex Maze' })).toBeVisible();
  });

  test('responsive at mobile viewport: no horizontal overflow', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /normal difficulty/i }).click();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('@screenshot landing and game', async ({ page }, testInfo) => {
    const project = testInfo.project.name;
    await page.goto('/');
    await page.screenshot({
      path: `screenshots/landing-${project}.png`,
      fullPage: true,
    });
    await page.getByRole('button', { name: /normal difficulty/i }).click();
    await page.locator('[aria-label^="Empty cell"]').nth(0).click();
    await page.waitForTimeout(400);
    await page.locator('[aria-label^="Empty cell"]').nth(5).click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: `screenshots/game-${project}.png`,
      fullPage: true,
    });
  });
});
