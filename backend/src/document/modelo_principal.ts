import { Injectable } from '@nestjs/common';

@Injectable() // Asegúrate de agregar este decorador
export class ModeloPrincipal {
    static collectionName: string = 'bs';
    id: string;
    namee: string;

    
}
