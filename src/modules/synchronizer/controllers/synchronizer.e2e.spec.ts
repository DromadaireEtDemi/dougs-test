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

  test('should return statusCode 200', async () => {
    const { statusCode, body } = await agent.post('/movements/validate').send({
      movements: [],
      balances: []
    });

    expect(statusCode).toEqual(HttpStatus.ACCEPTED);
    expect(body).toEqual({ message: 'Accepted', status: HttpStatus.ACCEPTED });
  });
});
