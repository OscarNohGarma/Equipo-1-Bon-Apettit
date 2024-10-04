

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';


import { ConfigModule, ConfigService} from '@nestjs/config';

import { FirestoreModule } from './module/firestore/firestore.module';
import { FirestoreMenuModule } from './module/firestoremenu/firestoremenu.module';
import { StorageService } from './services/storage-service/storage.service';
import { UploadController } from './controllers/upload/upload.controller';
import { FirestorageModule } from './module/firestore/firestorage/firestorage.module';
import { FirebaseMenuService } from './services/firebase_menu/firebase_menu.service';
import { FirebaseCitaController } from './controllers/firebase-cita/firebase-cita.controller';
import { FirebaseCitasService } from './services/firebase-citas/firebase-citas.service';
import { FirebaseOrdenService } from './services/firebase-orden/firebase-orden.service';
import { FirebaseOrdenController } from './controllers/firebase-orden/firebase-orden.controller';


@Module({
  imports: [
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
    

    FirestoreModule,FirestorageModule],
  controllers: [AppController, UploadController, FirebaseCitaController, FirebaseOrdenController],
  providers: [AppService,StorageService, FirebaseMenuService, FirebaseCitasService, FirebaseOrdenService],
})
export class AppModule {}
