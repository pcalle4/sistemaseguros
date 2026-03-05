import 'dotenv/config';
import 'reflect-metadata';
import { PrismaClient } from '@insurance/policy-prisma-client';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../../dist/app.module.js';
import { QUOTE_READ_CLIENT, QuoteReadClient } from '../../dist/domain/ports/quote-read.client.js';
import { configureHttpApp } from '../../dist/presentation/bootstrap/http-app.bootstrap.js';

const quoteReadClientMock: QuoteReadClient = {
  getQuoteById: vi.fn(async () => 'FOUND'),
};

describe('Policies Integration', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QUOTE_READ_CLIENT)
      .useValue(quoteReadClientMock)
      .compile();

    app = moduleRef.createNestApplication();
    configureHttpApp(app);
    await app.init();
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.policy.deleteMany();
    vi.clearAllMocks();
    vi.mocked(quoteReadClientMock.getQuoteById).mockResolvedValue('FOUND');
  });

  afterAll(async () => {
    await prisma.$disconnect();

    if (app) {
      await app.close();
    }
  });

  it('POST /policies with malformed uuid returns 400 Problem Details', async () => {
    const response = await request(app.getHttpServer())
      .post('/policies')
      .send({ quoteId: 'not-a-uuid' })
      .expect(400);

    expect(response.body.type).toBe('https://httpstatuses.com/400');
    expect(response.body.title).toBe('Bad Request');
    expect(response.body.detail).toBe('Validation failed');
    expect(response.body.errors[0].field).toBe('quoteId');
    expect(response.body.traceId).toBeTypeOf('string');
  });

  it('POST /policies returns 400 when quote does not exist', async () => {
    vi.mocked(quoteReadClientMock.getQuoteById).mockResolvedValue('NOT_FOUND');

    const response = await request(app.getHttpServer())
      .post('/policies')
      .send({ quoteId: '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553' })
      .expect(400);

    expect(response.body.type).toBe('https://httpstatuses.com/400');
    expect(response.body.title).toBe('Bad Request');
    expect(response.body.detail).toBe('Validation failed');
    expect(response.body.errors).toEqual([
      { field: 'quoteId', message: 'must reference an existing quote' },
    ]);
  });

  it('POST /policies creates and persists policy when quote exists', async () => {
    const quoteId = '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553';

    const response = await request(app.getHttpServer()).post('/policies').send({ quoteId }).expect(201);

    expect(response.body.id).toBeTypeOf('string');
    expect(response.body.quoteId).toBe(quoteId);
    expect(response.body.status).toBe('ACTIVE');
    expect(new Date(response.body.issuedAt).toString()).not.toBe('Invalid Date');

    const policy = await prisma.policy.findUnique({ where: { quoteId } });
    expect(policy).not.toBeNull();
    expect(policy?.quoteId).toBe(quoteId);
  });

  it('POST /policies returns 409 on double issuance for same quoteId', async () => {
    const quoteId = '8b2a9b7f-e0b0-4a7f-9bf1-066f6db53553';

    await request(app.getHttpServer()).post('/policies').send({ quoteId }).expect(201);

    const response = await request(app.getHttpServer()).post('/policies').send({ quoteId }).expect(409);

    expect(response.body.type).toBe('https://httpstatuses.com/409');
    expect(response.body.title).toBe('Conflict');
    expect(response.body.detail).toBe('Policy already issued for quote');
    expect(response.body.traceId).toBeTypeOf('string');
  });

  it('GET /policies/:id returns persisted policy', async () => {
    const quoteId = '66306eeb-0535-4d70-b0a3-ec30f6b6e49f';

    const createResponse = await request(app.getHttpServer())
      .post('/policies')
      .send({ quoteId })
      .expect(201);

    const getResponse = await request(app.getHttpServer())
      .get(`/policies/${createResponse.body.id}`)
      .expect(200);

    expect(getResponse.body).toEqual(createResponse.body);
  });
});
