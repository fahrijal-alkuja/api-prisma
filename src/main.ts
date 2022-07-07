import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const port = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port);
   Logger.log(
    `Server Runing to port:${port} url: ${await app.getUrl()}`,
    'Bootstrap',
  );
}
bootstrap();
