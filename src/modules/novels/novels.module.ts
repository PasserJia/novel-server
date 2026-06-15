import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { QuanbenAdapter } from '../sources/quanben.adapter';
import { NovelsController } from './novels.controller';
import { NovelsService } from './novels.service';

@Module({
  imports: [AuthModule],
  controllers: [NovelsController],
  providers: [NovelsService, QuanbenAdapter],
})
export class NovelsModule {}
