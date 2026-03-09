import 'dotenv/config';
import 'reflect-metadata';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../dist/app.module.js';
import { configureHttpApp } from '../dist/presentation/bootstrap/http-app.bootstrap.js';
import { UPSTREAM_GATEWAY_CLIENT, UpstreamGatewayClient } from '../dist/domain/ports/upstream-gateway.client.js';

type UpstreamMock = {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

describe('API Gateway', () => {
  let app: INestApplication;
  let upstreamMock: UpstreamMock;

  beforeAll(async () => {
    process.env.PORT = '3050';
    process.env.JWT_SECRET = 'libelulasoft';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.MOCK_AUTH_EMAIL = 'user@example.com';
    process.env.MOCK_AUTH_PASSWORD = 'password';
    process.env.QUOTE_SERVICE_URL = 'http://localhost:3060';
    process.env.POLICY_SERVICE_URL = 'http://localhost:3070';

    upstreamMock = {
      get: vi.fn(),
      post: vi.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UPSTREAM_GATEWAY_CLIENT)
      .useValue(upstreamMock satisfies UpstreamGatewayClient)
      .compile();

    app = moduleRef.createNestApplication();
    configureHttpApp(app, { enableSwagger: false });
    await app.init();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /auth/login returns a real JWT for valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password' })
      .expect(200);

    expect(response.body.tokenType).toBe('Bearer');
    expect(response.body.accessToken).toBeTypeOf('string');
    expect(response.body.accessToken.split('.')).toHaveLength(3);
  });

  it('POST /auth/login returns 401 Problem Details for invalid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrong-password' })
      .expect(401);

    expect(response.body.type).toBe('https://httpstatuses.com/401');
    expect(response.body.title).toBe('Unauthorized');
    expect(response.body.detail).toBe('Invalid credentials');
    expect(response.body.errors).toEqual([]);
  });

  it('GET /catalogs/insurance-types proxies data from quote-service', async () => {
    const payload = {
      status: 200,
      data: {
        items: [
          { code: 'AUTO', name: 'Seguro de Auto' },
          { code: 'SALUD', name: 'Seguro de Salud' },
        ],
      },
    };

    upstreamMock.get.mockResolvedValue(payload);

    const response = await request(app.getHttpServer()).get('/catalogs/insurance-types').expect(200);

    expect(response.body).toEqual(payload.data);
    expect(upstreamMock.get).toHaveBeenCalledWith({
      service: 'quote-service',
      path: '/catalogs/insurance-types',
    });
  });

  it('POST /policies returns 401 when token is missing', async () => {
    const response = await request(app.getHttpServer())
      .post('/policies')
      .send({ quoteId: '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553' })
      .expect(401);

    expect(response.body.type).toBe('https://httpstatuses.com/401');
    expect(response.body.detail).toBe('Missing or invalid bearer token');
  });

  it('POST /policies with a valid JWT proxies to policy-service', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'password' })
      .expect(200);

    const payload = {
      status: 201,
      data: {
        id: 'd4d2ac7f-1100-44b6-87af-f1c37dfd3282',
        quoteId: '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553',
        status: 'ACTIVE',
        issuedAt: '2026-03-05T22:00:00.000Z',
      },
    };

    upstreamMock.post.mockResolvedValue(payload);

    const response = await request(app.getHttpServer())
      .post('/policies')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .send({ quoteId: payload.data.quoteId })
      .expect(201);

    expect(response.body).toEqual(payload.data);
    expect(upstreamMock.post).toHaveBeenCalledWith({
      service: 'policy-service',
      path: '/policies',
      body: {
        quoteId: payload.data.quoteId,
      },
    });
  });

  it('returns 502 Problem Details when the upstream client fails', async () => {
    upstreamMock.get.mockRejectedValue(new Error('network down'));

    const response = await request(app.getHttpServer()).get('/catalogs/locations').expect(502);

    expect(response.body.type).toBe('https://httpstatuses.com/502');
    expect(response.body.title).toBe('Bad Gateway');
    expect(response.body.detail).toBe('Upstream service unavailable');
  });
});
