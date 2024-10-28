

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';


import { ConfigModule, ConfigService} from '@nestjs/config';

import { FirestoreModule } from './module/firestore/firestore.module';
import { FirestoreMenuModule } from './module/firestoreconfig/firestoreconfig.module';
import { StorageService } from './services/storage-service/storage.service';
import { UploadController } from './controllers/upload/upload.controller';
import { FirestorageModule } from './module/firestore/firestorage/firestorage.module';
import { FirebaseProductoService } from './services/firebase_producto/firebase_producto.service';
import { FirebaseCitaController } from './controllers/firebase-cita/firebase-cita.controller';
import { FirebaseCitasService } from './services/firebase-citas/firebase-citas.service';
import { FirebaseOrdenService } from './services/firebase-orden/firebase-orden.service';
import { FirebaseOrdenController } from './controllers/firebase-orden/firebase-orden.controller';
import { FireAuthController } from './controllers/fire-auth/fire-auth.controller';
import { FireAuthService } from './services/fire-auth/fire-auth.service';
import { GenericFirebaseController } from './controllers/generic/generic.controller';
import { FirebaseGenericService } from './services/firebase_generic/firebase_generic.service';
import { FirebaseUsuarioService } from './services/firebase-usuario/firebase-usuario.service';
import { FirebaseUsuarioController } from './controllers/firebase-usuario/firebase-usuario.controller';
import { FirebaseComprobanteService } from './services/firebase-comprobante/firebase-comprobante.service';
import { FirebaseComprobanteController } from './controllers/firebase-comprobante/firebase-comprobante.controller';
import { FireComentariosController } from './controllers/fire-comentarios/fire-comentarios.controller';
import { FireComentariosService } from './services/fire-comentarios/fire-comentarios.service';


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
  controllers: [AppController, UploadController, FirebaseCitaController, FirebaseOrdenController, FireAuthController, GenericFirebaseController, FirebaseUsuarioController, FirebaseComprobanteController, FireComentariosController],
  providers: [AppService,StorageService, FirebaseProductoService, FirebaseCitasService, FirebaseOrdenService, FireAuthService,FirebaseGenericService, FirebaseUsuarioService, FirebaseComprobanteService, FireComentariosService],
})
export class AppModule {}
