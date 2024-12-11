import { App } from '../../../../tests/utils/e2e.modules';
import { HttpStatus } from '@nestjs/common';

describe('SynchronizerController e2e Tests', () => {
  jest.setTimeout(80000);

  let agent;

  beforeAll(async () => {
    agent = await App.getAgent();
  });

  afterAll(async () => {
    App.stopApp();
  });

  test('should return 200 with health OK', async () => {
    const { statusCode, body } = await agent.get('/health').send({
      movements: [],
      balances: []
    });

    expect(statusCode).toEqual(HttpStatus.OK);
    expect(body).toEqual({ status: 'ok', info: {}, error: {}, details: {} });
  });
});
