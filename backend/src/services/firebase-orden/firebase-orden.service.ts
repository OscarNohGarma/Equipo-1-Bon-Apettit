import { Injectable } from '@nestjs/common';
import { FirebaseProductoService } from '../firebase_producto/firebase_producto.service';

@Injectable()
export class FirebaseOrdenService extends FirebaseProductoService{}
