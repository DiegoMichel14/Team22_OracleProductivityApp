import { test, expect } from '@playwright/test';

// TEST-008 - Login y acceso a la pestaña Developer Hours en reportes
//
// Este test automatiza el flujo donde el usuario:
// 1. Inicia sesión con credenciales válidas
// 2. Accede a la sección de reportes desde el dashboard
// 3. Entra a la pestaña "Developer Hours"

test.describe('@auth @reports - Acceso directo a reportes', () => {
  test('TEST-008 - Login y navegación a Developer Hours', async ({ page }) => {
    // 1. Iniciar sesión
    await page.goto('http://159.54.152.241/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: 'Username' }).fill('3314639647');
    await page.getByRole('textbox', { name: 'Password' }).fill('contrasenaSegura3');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/dashboard/i);

    // 2. Ir directamente a la sección de reportes
    await page.getByRole('button', { name: 'Reports' }).click();

    // 3. Ir a la pestaña "Developer Hours"
    await page.getByRole('tab', { name: 'Developer Hours' }).click();

    // (Opcional) Verificar contenido en la pestaña
    // await expect(page.locator('text=Horas por desarrollador')).toBeVisible();
  });
});
