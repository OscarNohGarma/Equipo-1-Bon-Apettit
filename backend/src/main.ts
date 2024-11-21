import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://')) {
        callback(null, true); // Permite todas las solicitudes desde 'http://'
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
