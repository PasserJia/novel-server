import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SourcesController } from './sources.controller';

@Module({
  imports: [AuthModule],
  controllers: [SourcesController],
})
export class SourcesModule {}
