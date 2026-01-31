import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: config.get<string>('REDIS_HOST') || 'localhost',
            port: config.get<number>('REDIS_PORT') || 6379,
          },
          ttl: config.get<number>('CACHE_TTL') || 60000, // 1 minute default
        }),
        isGlobal: true,
      }),
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
