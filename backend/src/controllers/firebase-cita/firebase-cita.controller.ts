import { Controller,Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { FirebaseCitasService } from 'src/services/firebase-citas/firebase-citas.service';
import { GenericFirebaseController } from '../generic/generic.controller';


@Controller('reservacion')
export class FirebaseCitaController extends GenericFirebaseController{
    constructor(private readonly servicio: FirebaseCitasService) {
        super(servicio); // Llama al constructor de la clase padre
        this.collectionName = "reservaciones"; // Asigna el nombre de colección específico para esta clase
      }
    
    
  
}



