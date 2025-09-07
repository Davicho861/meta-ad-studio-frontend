import http from 'k6/http';
import { check, sleep } from 'k6';

// Opciones de la prueba de carga.
// Simula un aumento gradual de usuarios, mantiene la carga y luego disminuye.
export const options = {
  scenarios: {
    us_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 300000 }, // Increased to 300k for 1M+ total
        { duration: '10m', target: 300000 },
        { duration: '5m', target: 0 },
      ],
      env: { REGION: 'us' },
    },
    eu_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 180000 }, // Increased to 180k for 1M+ total
        { duration: '10m', target: 180000 },
        { duration: '5m', target: 0 },
      ],
      env: { REGION: 'eu' },
    },
    apac_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 120000 }, // Increased to 120k for 1M+ total
        { duration: '10m', target: 120000 },
        { duration: '5m', target: 0 },
      ],
      env: { REGION: 'apac' },
    },
    metaverse_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5m', target: 600000 }, // Increased to 600k for 1M+ total
        { duration: '10m', target: 600000 },
        { duration: '5m', target: 0 },
      ],
      env: { REGION: 'metaverse' },
    }
  },
};

const endpoints = {
  us: 'http://us.api.example.com',
  eu: 'http://eu.api.example.com',
  apac: 'http://apac.api.example.com',
  metaverse: 'http://metaverse.api.example.com',
};

// La función que cada usuario virtual ejecutará repetidamente.
export default function () {
  const region = __ENV.REGION;
  const baseUrl = endpoints[region];

  // Generar datos de usuario aleatorios para cada iteración
  const uniqueEmail = `user_${__VU}_${__ITER}@test.com`;
  const password = 'password123';

  // 1. Probar el endpoint de registro (esto generará carga en la base de datos)
  const registerRes = http.post(`${baseUrl}/api/auth/register`, JSON.stringify({
    email: uniqueEmail,
    password: password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // Verificar que el registro fue exitoso (código de respuesta 201)
  check(registerRes, { 'register successful': (r) => r.status === 201 });

  sleep(1); // Esperar 1 segundo entre acciones

  // 2. Probar el endpoint de salud (esto es una carga más ligera)
  const healthRes = http.get(`${baseUrl}/api/health`);
  
  // Verificar que la API está saludable (código de respuesta 200)
  check(healthRes, { 'healthcheck successful': (r) => r.status === 200 });

  // 3. Probar el endpoint de monetización
  const monetizationRes = http.post(`${baseUrl}/api/monetization/charge`, JSON.stringify({
    amount: 1000,
    currency: 'usd',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(monetizationRes, { 'monetization successful': (r) => r.status === 200 });

  // 4. Probar el endpoint de anuncios
  const adRes = http.get(`${baseUrl}/api/ads/request`);

  check(adRes, { 'ad request successful': (r) => r.status === 200 });

  // 5. Probar el endpoint de metaverso (VR/AR)
  if (region === 'metaverse') {
    const vrAdPreviewRes = http.post(`${baseUrl}/api/vr/preview`, JSON.stringify({
      ad_id: "12345",
      user_id: __VU,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(vrAdPreviewRes, { 'vr ad preview successful': (r) => r.status === 200 });
  }
}
