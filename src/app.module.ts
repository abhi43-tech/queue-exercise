import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { Countries } from './country/entity/country.entity';
import { TimeSeries } from './timeseries/entity/timeseries.entity';
import { TimeSeriesModule } from './timeseries/timeseries.module';
import { DataModule } from './data-endpoint/data.module';
import { User } from './user/entity/user.enity';
import { UserModule } from './user/user.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        database: 'covid_data',
        port: Number(3306),
        username: 'root',
        password: '',
        host: 'localhost',
        entities: [Countries, TimeSeries, User],
        synchronize: true,
        // logging: true,
      }),
    }),
    CountryModule,
    TimeSeriesModule,
    DataModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
