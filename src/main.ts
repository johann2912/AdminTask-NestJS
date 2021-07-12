import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as auth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/docs',
    auth({
      challenge: true,
      users: { AdminTask: '12345' },
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Task Manager')
    .setDescription(
      'This API consists of a CRUD of users, CRUD of tasks, and additionally it has routes where you can: mark tasks as completed, generate a report on the fulfillment of assigned tasks and a route to refresh tokens',
    )
    .setVersion('0.0.1')
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  app.enableCors({
    origin: '*',
  });

  await app.listen(4015);
}
bootstrap();
