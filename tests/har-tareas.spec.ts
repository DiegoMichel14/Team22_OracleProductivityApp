import { test, expect } from '@playwright/test';
import path from 'path';

test('generate HAR for /tareas', async ({ browser }) => {
  const context = await browser.newContext({
    recordHar: {
      path: './har/tareas.har', // Guarda el HAR aquí
    },
  });

  const page = await context.newPage();

  // Visitar la página que realiza la llamada a /tareas
  await page.goto('http://159.54.152.241/tareas');

  // Esperar un poco para que se carguen los datos
  await page.waitForTimeout(3000); // Puedes ajustar el tiempo si es necesario

  // Cerrar el contexto para guardar el HAR
  await context.close();
});




test('mock /tareas using HAR', async ({ context, page }) => {
  await context.routeFromHAR(path.join(__dirname, '../har/tareas.har'), {
    update: false,
  });

  await page.goto('http://159.54.152.241/tareas', { waitUntil: 'domcontentloaded' });

  // Verifica contenido basado en los datos HAR grabados
  await expect(page.getByText('Desarrollar presentación semana 5')).toBeVisible();
  await expect(page.getByText('Fusionar cambios a rama main')).toBeVisible();
  await expect(page.getByText('Entrega delivery 1: Calidad')).toBeVisible();
});
