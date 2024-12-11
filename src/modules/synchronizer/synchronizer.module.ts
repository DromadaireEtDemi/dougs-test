import { Module } from '@nestjs/common';
import { SynchronizerController } from './controllers/synchronizer';
import { SynchronizerService } from './services/synchronizer';

@Module({
  controllers: [SynchronizerController],
  providers: [SynchronizerService]
})
export class SynchronizerModule {}
