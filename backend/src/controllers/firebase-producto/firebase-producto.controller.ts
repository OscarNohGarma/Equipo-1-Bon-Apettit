import { Controller, Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { Menu } from 'src/document/modelos';
import { FirebaseProductoService } from 'src/services/firebase_producto/firebase_producto.service';
import { GenericFirebaseController } from '../generic/generic.controller';

@Controller('producto')
export class FirebaseProductoController extends GenericFirebaseController{
    constructor(private readonly servicio: FirebaseProductoService) {
        super(servicio); // Llama al constructor de la clase padre
        this.collectionName = "menu"; // Asigna el nombre de colección específico para esta clase
      }
}
