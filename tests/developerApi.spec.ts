import { test, expect } from '@playwright/test';

// TEST-002 - Mostrar información mockeada del developer

// Este test verifica que la aplicación muestre correctamente los datos de un desarrollador 
// obtenidos desde la API `/developers/1`. En lugar de depender de una respuesta real del servidor, 
// se utiliza un mock de red para interceptar la petición y devolver una respuesta simulada.

test.describe('@mock @developer - Mock API /developers/1', () => {
  test('TEST-004 - Mostrar información mockeada del developer', async ({ page }) => {
    
    // Interceptamos cualquier petición GET a /developers/1 y devolvemos una respuesta personalizada
    await page.route('**/developers/1', async route => {
      console.log('Mock aplicado a /developers/1');

      // Respondemos con datos simulados (sin conectarse a la API real)
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          idDeveloper: 1,
          nombre: 'Diego',
          apellidoPaterno: 'Michel',
          apellidoMaterno: 'Castro',
          equipo: { idEquipo: 1, nombreEquipo: 'Equipo 22' },
          esManager: true,
          telefono: '3121539670',
          contrasena: 'contrasenaSegura1'
        }),
      });
    });

    // Navegamos directamente a la página del developer con ID 1
    await page.goto('http://159.54.152.241/developers/1', { waitUntil: 'domcontentloaded' });

    // Validamos que la información mockeada se muestre correctamente en la UI

    // Validar que el nombre y apellidos estén visibles
    await expect(page.locator('text=Diego')).toBeVisible();
    await expect(page.locator('text=Michel')).toBeVisible();
    await expect(page.locator('text=Castro')).toBeVisible();

    // Validar nombre del equipo
    await expect(page.locator('text=Equipo 22')).toBeVisible();

    // Validar número de teléfono
    await expect(page.locator('text=3121539670')).toBeVisible();

    // Validar que se identifique como manager 
    await expect(page.locator('text=Manager')).toBeVisible();
  });
});

