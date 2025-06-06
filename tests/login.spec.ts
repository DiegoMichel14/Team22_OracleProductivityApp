// TEST-001 - Login con teléfono y contraseña

// Este test automatiza el proceso de inicio de sesión en la aplicación,
// utilizando un número de teléfono y una contraseña válidos.

import { test, expect } from '@playwright/test';

test('TEST-001 - Login con teléfono y contraseña', async ({ page }) => {
  // Ir a la página, evitando espera larga de carga
  await page.goto('http://159.54.152.241/', {
    waitUntil: 'domcontentloaded'
  });

  // Llenar campos de contrasena y telefono 
  await page.getByRole('textbox', { name: 'Username' }).fill('3314639647');
  await page.getByRole('textbox', { name: 'Password' }).fill('contrasenaSegura3');

  // Clic en login
  await page.getByRole('button', { name: 'Log in' }).click();

  // Esperar redirección
  await expect(page).toHaveURL(/dashboard/i);

  // Validar visibilidad de encabezado
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});


