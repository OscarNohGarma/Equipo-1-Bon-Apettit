import { Module } from '@nestjs/common';
import { FirebaseProductoController } from 'src/controllers/firebase-producto/firebase-producto.controller';
import { FirebaseProductoService } from 'src/services/firebase_producto/firebase_producto.service';
import { FirestorageModule} from './firestorage/firestorage.module';
import { StorageService } from '../../services/storage-service/storage.service';
import { upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';
import { UploadController } from 'src/controllers/upload/upload.controller';
import { FirebaseCitaController } from 'src/controllers/firebase-cita/firebase-cita.controller';
import { FirebaseCitasService } from 'src/services/firebase-citas/firebase-citas.service';
import { FirebaseMenuService } from 'src/services/firebase_menu/firebase_menu.service';
import { FirebaseOrdenController } from 'src/controllers/firebase-orden/firebase-orden.controller';
import { FirebaseOrdenService } from 'src/services/firebase-orden/firebase-orden.service';


@Module({
    providers: [FirebaseProductoService,
        StorageService,
        FirebaseCitasService, 
        FirebaseMenuService,
        FirebaseOrdenService],
    controllers: [
        FirebaseProductoController,
        UploadController, 
        FirebaseCitaController,
        FirebaseOrdenController
                    
    ],
    imports: [FirestorageModule],
}) 
export class FirestoreModule{
    
}

