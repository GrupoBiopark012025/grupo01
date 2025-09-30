import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MikroORM } from '@mikro-orm/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const apiPath = 'api';
  app.setGlobalPrefix(apiPath);

  const mikroOrm = app.get(MikroORM);
  await mikroOrm.getMigrator().up();

  const config = new DocumentBuilder()
    .setTitle('Action Planner')
    .setDescription('The Action Planner API description')
    .setVersion('1.0')
    .addTag('ActionPlanner')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPath}/docs`, app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
