import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: config.get('CORS_ORIGIN')?.split(',') || '*',
    credentials: true,
  });

  app.setGlobalPrefix(config.get('API_PREFIX') || 'api/v1');

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  if (config.get('SWAGGER_ENABLED') === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Notely API')
      .setDescription('REST API for Notely - A Notion-like notes application')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
      config.get('SWAGGER_PATH') || 'api/docs',
      app,
      document,
    );
  }

  const port = config.get('PORT') || 3001;
  await app.listen(port);

  console.log('');
  console.log('🚀 Notely API is running!');
  console.log('');
  console.log(
    `📍 API: http://localhost:${port}/${config.get('API_PREFIX') || 'api/v1'}`,
  );
  console.log(
    `📚 Swagger: http://localhost:${port}/${config.get('SWAGGER_PATH') || 'api/docs'}`,
  );
  console.log('');
}

void bootstrap();
