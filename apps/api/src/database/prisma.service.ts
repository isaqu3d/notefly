import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✓ Database connected successfully');
    } catch (error) {
      this.logger.error('✗ Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('✓ Database disconnected successfully');
    } catch (error) {
      this.logger.error('✗ Failed to disconnect from database', error);
    }
  }

  async cleanDatabase() {
    if (this.configService.get('NODE_ENV') === 'production') {
      throw new Error('Cannot clean database in production');
    }

    this.logger.warn('⚠️  Cleaning database...');

    const models = Reflect.ownKeys(this).filter(
      (key) => typeof key === 'string' && key[0] !== '_',
    );

    for (const modelKey of models) {
      const model = this[modelKey as keyof this];
      if (
        model &&
        typeof model === 'object' &&
        'deleteMany' in model &&
        typeof model.deleteMany === 'function'
      ) {
        await model.deleteMany();
      }
    }

    this.logger.log('✓ Database cleaned');
  }
}
