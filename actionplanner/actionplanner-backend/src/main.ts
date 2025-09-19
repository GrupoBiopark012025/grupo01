import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const mikroOrm = app.get(MikroORM);
  await mikroOrm.getMigrator().up();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
