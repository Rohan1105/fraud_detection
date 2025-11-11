import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CustomerModule } from './modules/customer/customer.module';
import { InsightsModule } from './modules/insights/insights.module';
import { HealthModule } from './modules/health/health.module';
import { SharedModule } from './modules/shared/shared.module';
import { RuleModule } from './modules/rules/rules.module';
import * as redisStore from 'cache-manager-ioredis';
import { FraudModule } from './modules/fraud/fraud.module';

@Module({
  imports: [
     // PostgreSQL connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // mapped by Docker
      port: 5432,
      username: 'ts_user', // from docker-compose.yml
      password: 'ts_pass',
      database: 'ts_db',
      autoLoadEntities: true, // auto-load entities
      synchronize: true, // dev only, auto-create tables
    }),

    // Redis connection
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost', // mapped by Docker
      port: 6379,
    }),

    TransactionsModule,

    CustomerModule,

    InsightsModule,

    HealthModule,

    SharedModule,

    RuleModule,

    FraudModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
