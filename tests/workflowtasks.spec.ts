import { test, expect } from '@playwright/test';

// TEST-005 - Login, navegación a tareas, y selección de developer
//
// Esta prueba automatiza un flujo completo que incluye:
// - Inicio de sesión con teléfono y contraseña
// - Navegación al módulo de tareas
// - Selección de un developer específico
// - Navegación a la pestaña de tareas completadas
//
// Se valida que los elementos claves de la interfaz sean accesibles y funcionen correctamente.

test.describe('@workflow @tasks - Flujo completo de navegación', () => {
  test('TEST-005 - Login y selección de tareas por developer', async ({ page }) => {
    // Navegar a la página principal
    await page.goto('http://159.54.152.241/', { waitUntil: 'domcontentloaded' });

    // Llenar credenciales
    await page.getByRole('textbox', { name: 'Username' }).fill('3314639647');
    await page.getByRole('textbox', { name: 'Password' }).fill('contrasenaSegura3'); // ← corregida ortografía

    // Hacer login
    await page.getByRole('button', { name: 'Log in' }).click();

    // Esperar que el login redirija correctamente
    await expect(page).toHaveURL(/dashboard/i);

    // Ir a la sección de tareas
    await page.getByRole('button', { name: 'Tasks' }).click();

    // Validar que el encabezado esté presente
    await expect(page.getByRole('heading', { name: /Developer Selection/i })).toBeVisible();

    // Abrir menú de selección de developer
    await page.getByRole('button', { name: /Select Developer Adair/i }).click();

    // Seleccionar el developer "Omar"
    await page.getByRole('option', { name: 'Omar' }).click();

    // Cambiar a la pestaña de tareas completadas
    await page.getByRole('tab', { name: 'Completed' }).click();

    // Validar que se haya mostrado el contenido correctamente (opcional)
    // await expect(page.locator('text=Tareas completadas')).toBeVisible();
  });
});
