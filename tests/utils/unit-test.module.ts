import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class UnitTestsModule {
  static async forRoot(): Promise<DynamicModule> {
    return {
      module: UnitTestsModule,
    };
  }
}
