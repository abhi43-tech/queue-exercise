import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MailService } from './mail.service';

@Injectable()
export class MailQueueService {
  constructor(
    @InjectQueue('daily-update') private readonly updateQueue: Queue,
    private readonly mailService: MailService,
  ) {}

  async addEmailJob(email: string) {
    await this.updateQueue.add(
      'send-email',
      { email },
      {
        repeat: { every: 60 * 1000 },
      },
    );
  }

  async processEmailJob(email: string, subject: string, text: string) {
    await this.mailService.sendMail({ email, subject, text });
  }
}
