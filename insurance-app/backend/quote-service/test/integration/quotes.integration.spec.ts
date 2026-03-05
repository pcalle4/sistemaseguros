import { spawn } from 'child_process';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const BASE_URL = 'http://127.0.0.1:3060';

type ServerProcess = ReturnType<typeof spawn>;

async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Server not ready within ${timeoutMs}ms`);
}

describe('Quotes Integration', () => {
  let serverProcess: ServerProcess;

  beforeAll(async () => {
    serverProcess = spawn('node', ['dist/main.js'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PORT: '3060',
      },
      stdio: 'pipe',
    });

    await waitForServer(`${BASE_URL}/health`, 45000);
  });

  afterAll(async () => {
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill('SIGTERM');
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  });

  it('POST /quotes creates a quote with expected premium', async () => {
    const payload = {
      insuranceType: 'AUTO',
      coverage: 'PREMIUM',
      age: 35,
      location: 'EC-AZUAY',
    };

    const response = await request(BASE_URL).post('/quotes').send(payload).expect(201);

    expect(response.body.id).toBeTypeOf('string');
    expect(response.body.status).toBe('QUOTED');
    expect(response.body.inputs).toEqual(payload);
    expect(response.body.estimatedPremium).toBe(350);
    expect(response.body.breakdown).toEqual([
      { concept: 'BASE', amount: 200 },
      { concept: 'AGE_FACTOR', amount: 60 },
      { concept: 'LOCATION_FACTOR', amount: 40 },
      { concept: 'COVERAGE_FACTOR', amount: 50 },
    ]);
    expect(new Date(response.body.createdAt).toString()).not.toBe('Invalid Date');
  });

  it('POST /quotes returns Problem Details when insuranceType is invalid', async () => {
    const payload = {
      insuranceType: 'INVALID',
      coverage: 'PREMIUM',
      age: 35,
      location: 'EC-AZUAY',
    };

    const response = await request(BASE_URL).post('/quotes').send(payload).expect(400);

    expect(response.body.type).toBe('https://httpstatuses.com/400');
    expect(response.body.title).toBe('Bad Request');
    expect(response.body.status).toBe(400);
    expect(response.body.detail).toBe('Validation failed');
    expect(response.body.instance).toBe('/quotes');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([{ field: 'insuranceType', message: 'must be a valid catalog value' }]),
    );
    expect(response.body.traceId).toBeTypeOf('string');
  });

  it('GET /quotes/:id returns the same persisted payload', async () => {
    const payload = {
      insuranceType: 'SALUD',
      coverage: 'ESTANDAR',
      age: 42,
      location: 'EC-PICHINCHA',
    };

    const createResponse = await request(BASE_URL).post('/quotes').send(payload).expect(201);

    const quoteId = createResponse.body.id;
    const getResponse = await request(BASE_URL).get(`/quotes/${quoteId}`).expect(200);

    expect(getResponse.body).toEqual(createResponse.body);
  });
});
