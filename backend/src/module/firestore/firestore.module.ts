import { Module } from '@nestjs/common';
import { FirebaseProductoController } from 'src/controllers/firebase-producto/firebase-producto.controller';
import { FirebaseProductoService } from 'src/services/firebase_producto/firebase_producto.service';


@Module({
    providers: [FirebaseProductoService],
    controllers: [FirebaseProductoController],
}) 
export class FirestoreModule{
    
}

