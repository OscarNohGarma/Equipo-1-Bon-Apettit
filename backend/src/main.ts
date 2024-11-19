import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200', // Cambia según sea necesario
  }); // Habilitar CORS con configuración predeterminada
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
