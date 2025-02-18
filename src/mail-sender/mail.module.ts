import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailQueueService } from './mail.queue.service';
import { DailyConsumer } from './mail.worker';
import { MailService } from './mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSeries } from 'src/timeseries/entity/timeseries.entity';
import { User } from 'src/user/entity/user.enity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeSeries, User]),
    BullModule.registerQueue({
      name: 'daily-update',
    }),
  ],
  providers: [DailyConsumer, MailQueueService, MailService],
  exports: [MailQueueService],
})
export class MailModule {}
