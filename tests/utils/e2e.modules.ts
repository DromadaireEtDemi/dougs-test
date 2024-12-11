import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Response } from 'supertest';
import * as supertest from 'supertest';
import { AppModule } from 'src/app.module';

export class App {
  static app: INestApplication;

  static async getApp(): Promise<INestApplication> {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    App.app = module.createNestApplication();
    await App.app.init();
    await App.app.listen(0, '0.0.0.0');
    return App.app;
  }

  static async stopApp() {
    await App.app.close();
  }

  static async getAgent(): Promise<Response> {
    if (!App.app) {
      await App.getApp();
    }
    return supertest.agent(await App.app.getUrl()).set({ Accept: 'application/json' });
  }
}
