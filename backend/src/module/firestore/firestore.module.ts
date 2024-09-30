import { Module } from '@nestjs/common';
import { FirebaseProductoController } from 'src/controllers/firebase-producto/firebase-producto.controller';
import { FirebaseProductoService } from 'src/services/firebase_producto/firebase_producto.service';
import { FirestorageModule} from './firestorage/firestorage.module';
import { StorageService } from '../../services/storage-service/storage.service';
import { upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';
import { UploadController } from 'src/controllers/upload/upload.controller';


@Module({
    providers: [FirebaseProductoService,StorageService],
    controllers: [FirebaseProductoController,UploadController],
    imports: [FirestorageModule],
}) 
export class FirestoreModule{
    
}

