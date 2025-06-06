
import { test, expect } from '@playwright/test';

// TEST-007 - Login y selección de tarea de Omar en el mes anterior
//
// Este test verifica el flujo completo desde el inicio de sesión hasta la selección
// de una tarea específica del developer "Omar" en el calendario del mes anterior.

test.describe('@auth @calendar @tasks - Selección de tarea por mes anterior', () => {
  test('TEST-007 - Login y seleccionar tarea de Omar en mes anterior', async ({ page }) => {
    // 1. Iniciar sesión
    await page.goto('http://159.54.152.241/', { waitUntil: 'domcontentloaded' });

    await page.getByRole('textbox', { name: 'Username' }).fill('3314639647');
    await page.getByRole('textbox', { name: 'Password' }).fill('contrasenaSegura3');
    await page.getByRole('button', { name: 'Log in' }).click();

    // 2. Asegurarse de estar en el dashboard
    await expect(page).toHaveURL(/dashboard/i);

    // 3. Ir al mes anterior en el calendario
    await page.getByRole('link', { name: 'Previous Month' }).click();

    // 4. Mostrar tareas del bloque (por ejemplo, "5Tareas:")
    await page.getByText('5Tareas:').click();

    // 5. Seleccionar al developer "Omar"
    await page.locator('div').filter({ hasText: /^Omar$/ }).first().click();

    // 6. Hacer clic en una tarea específica de Omar
    await page.locator('div').filter({ hasText: /^testPendiente02$/ }).click();
  });
});
