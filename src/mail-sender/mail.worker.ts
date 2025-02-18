import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailQueueService } from './mail.queue.service';
import { User } from 'src/user/entity/user.enity';
import { TimeSeries } from 'src/timeseries/entity/timeseries.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Processor('daily-update')
export class DailyConsumer extends WorkerHost {
  constructor(
    private readonly mailQueueService: MailQueueService,
    @InjectRepository(TimeSeries)
    private timeSeriesRepository: Repository<TimeSeries>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super();
  }

  async process(job: Job) {
    console.log(`Processing job: ${job.id}`);
    const user = await this.userRepo.findOne({
      where: { email: job.data.email },
    });
    if (!user.subscribe || user.subscribe.length === 0) {
      return;
    }

    const totalText = await this.getData(user.subscribe);
    const dateText = await this.getDateData(user.subscribe);
    const text = totalText + '\n\n' + dateText;
    const date =
      new Date().getDate() +
      ' ' +
      new Date().toLocaleDateString('default', { month: 'long' });
    const subject = `Daily Update - ${date}`;

    await this.mailQueueService.processEmailJob(job.data.email, subject, text);
  }

  private async getData(condition: number[]) {
    condition = condition.map((id) => Number(id));
    const query = await this.timeSeriesRepository
      .createQueryBuilder('timeseries')
      .select('timeseries.name', 'name')
      .addSelect('SUM(timeseries.confirmed)', 'confirmed')
      .addSelect('SUM(timeseries.deaths)', 'deaths')
      .addSelect('SUM(timeseries.recovered)', 'recovered')
      .where('timeseries.country_id IN (:...condition)', { condition })
      .groupBy('timeseries.name');

    const result = await query.getRawMany();
    const text = result
      .map(
        (item) =>
          `Name: ${item.name}, Confirmed: ${item.confirmed}, Deaths: ${item.deaths}, Recovered: ${item.recovered}`,
      )
      .join('\n');
    return text;
  }

  private async getDateData(condition: number[]) {
    condition = condition.map((id) => Number(id));
    const formattedDate = new Date().toISOString().split('T')[0];
    const query = await this.timeSeriesRepository
      .createQueryBuilder('timeseries')
      .select('*')
      .where('timeseries.country_id IN (:...condition)', { condition })
      .andWhere('DATE(timeseries.date) = :date', { date: formattedDate });

    const result = await query.getRawMany();
    const text = result
      .map(
        (item) =>
          `Name: ${item.name}, Date: ${item.date}, Confirmed: ${item.confirmed}, Deaths: ${item.deaths}, Recovered: ${item.recovered}`,
      )
      .join('\n');
    return text;
  }
}
