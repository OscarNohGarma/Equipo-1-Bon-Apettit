import { Controller } from '@nestjs/common';
import { FirebaseUsuarioService } from 'src/services/firebase-usuario/firebase-usuario.service';
import { GenericFirebaseController } from '../generic/generic.controller';

@Controller('usuario')
export class FirebaseUsuarioController  extends GenericFirebaseController{
    constructor(private readonly servicio: FirebaseUsuarioService) {
        super(servicio); // Llama al constructor de la clase padre
        this.collectionName = "usuario"; // Asigna el nombre de colección específico para esta clase
      }
}
