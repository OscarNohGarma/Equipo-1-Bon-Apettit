import { Controller } from '@nestjs/common';
import { UploadController } from '../upload/upload.controller';
import { FirebaseComprobanteService } from 'src/services/firebase-comprobante/firebase-comprobante.service';

@Controller('comprobante')
export class FirebaseComprobanteController extends UploadController{
    constructor(private readonly servicio: FirebaseComprobanteService) {
        super(servicio); // Llama al constructor de la clase padre
        
      }
}
