import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class UnitTestsModule {
  static async forRoot(): Promise<DynamicModule> {
    return {
      module: UnitTestsModule
    };
  }
}
