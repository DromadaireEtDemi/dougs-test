import { Module } from '@nestjs/common';
import { SynchronizerModule } from './modules/synchronizer/synchronizer.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [SynchronizerModule, HealthModule]
})
export class AppModule {}
