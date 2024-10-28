import { Module } from '@nestjs/common';
import { FirebaseProductoController } from 'src/controllers/firebase-producto/firebase-producto.controller';
import { FirebaseGenericService } from 'src/services/firebase_generic/firebase_generic.service';
import { FirestorageModule} from './firestorage/firestorage.module';
import { StorageService } from '../../services/storage-service/storage.service';
import { upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';
import { UploadController } from 'src/controllers/upload/upload.controller';
import { FirebaseCitaController } from 'src/controllers/firebase-cita/firebase-cita.controller';
import { FirebaseCitasService } from 'src/services/firebase-citas/firebase-citas.service';
import { FirebaseProductoService } from 'src/services/firebase_producto/firebase_producto.service';
import { FirebaseOrdenController } from 'src/controllers/firebase-orden/firebase-orden.controller';
import { FirebaseOrdenService } from 'src/services/firebase-orden/firebase-orden.service';
import { FireAuthModule } from './fire-auth/fire-auth.module';
import { FireAuthService } from 'src/services/fire-auth/fire-auth.service';
import { FireAuthController } from 'src/controllers/fire-auth/fire-auth.controller';
import { GenericFirebaseController } from 'src/controllers/generic/generic.controller';
import { ModeloPrincipal } from 'src/document/modelo_principal';
import { FireComentariosService } from 'src/services/fire-comentarios/fire-comentarios.service';
import { FireComentariosController } from 'src/controllers/fire-comentarios/fire-comentarios.controller';


@Module({
    providers: [
        
        FirebaseGenericService,
        StorageService,
        FirebaseCitasService, 
        FirebaseProductoService,
        FirebaseOrdenService,
        FireAuthService,
        FireComentariosService],
    controllers: [
        FirebaseProductoController,
        UploadController, 
        FirebaseCitaController,
        FirebaseOrdenController,
        FireAuthController,
        FireComentariosController,
        GenericFirebaseController
                    
    ],
    imports: [FirestorageModule, FireAuthModule],
}) 
export class FirestoreModule{
    
}

