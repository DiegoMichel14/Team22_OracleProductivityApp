import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    // Configuración compartida para todos los proyectos
    baseURL: 'http://159.54.152.241', // Puedes cambiarlo si es necesario
    video: 'on',                      // ✅ Grabación de video para cada test
    screenshot: 'only-on-failure',   // ✅ Screenshot automático si falla
    trace: 'retain-on-failure',      // ✅ Trazas para debug si falla
    headless: true                   // Puedes ponerlo en false para depurar visualmente
  },

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
   
  ],

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],

  // Opcional: levantar servidor local si lo usas
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
