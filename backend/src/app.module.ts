import { ProductosModule } from './module/productos.module';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService} from '@nestjs/config';

import { FirestoreModule } from './module/firestore/firestore.module';
import { FirebaseProductoService } from './services/firebase_producto/firebase_producto.service';
import { FirestoreMenuModule } from './module/firestoremenu/firestoremenu.module';
import { FirebaseProductoController } from './controllers/firebase-producto/firebase-producto.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot(
       {
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "",
        "database": "elabuelo",
        "entities": [join(__dirname, '**', '*.entity.{ts,js}')],
        "synchronize": true,
      }
    ),ProductosModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    FirestoreMenuModule.forRoot({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        keyFilename: ConfigService.get<string>('SA_KEY'),
      }),
      inject: [ConfigService],
    }),

    FirestoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
