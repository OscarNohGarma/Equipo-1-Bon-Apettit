import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { Orden } from 'src/document/modelos';
import { Producto } from 'src/document/producto_model';
import { ProductoEntity } from 'src/producto.entity';
import { FirebaseOrdenService } from 'src/services/firebase-orden/firebase-orden.service';
import { FirebaseProductoService } from 'src/services/firebase_producto/firebase_producto.service';
import { GenericFirebaseController } from '../generic/generic.controller';

@Controller('orden')
export class FirebaseOrdenController extends GenericFirebaseController {
  constructor(
    private readonly servicio: FirebaseOrdenService,
    private readonly servicio2: FirebaseProductoService,
  ) {
    super(servicio); // Llama al constructor de la clase padre
    this.collectionName = 'orden'; // Asigna el nombre de colección específico para esta clase
  }

  @Get('/:id')
  async getOrdenById(@Param('id') ordenId: string) {
    var nombres: string[];
    const orden = await this.servicio.getEntityById(ordenId, 'orden');
    const menu = await this.servicio2.getAllEntities('menu');
    nombres = orden.productos.map((hashMap) => hashMap['id']);
    var ordenn = orden.productos;
    //console.log(nombres);  // Mostrar los nombres en consola

    ordenn.forEach((item2) => {
      menu.forEach((item: any) => {
        //console.log(item); // Aquí puedes acceder a cada elemento
        if (item2.id == item.id) {
          item2.namee = item.namee; // Aquí se agrega el nombre
          item2.categoria = item.categoria;
          //item2.subtotal = Number(item2.quantity) * Number(item.precio)
          item2.image = item.image;
          item2.precio = item.precio;
          //console.log(item.namee); // Ejemplo: acceder a la clave 'id'
        }
      });
    });
    orden.productos = ordenn;
    console.log(ordenn);

    return orden;
  }


  @Get('')
async getAllEntities() {
    const ordenes = await this.servicio.getAllEntities('orden');

    // Extraer fecha y hora de las órdenes
    const result = ordenes.map(orden => ({
        fecha: orden.fecha,
        hora: orden.hora,
    }));

    // Función para convertir fecha y hora en un timestamp
    const getTimestamp = (fecha: string, hora: string): number => {
        const [day, month, year] = fecha.split('/').map(Number);
        const [time, modifier] = hora.split(' ');

        // Convertir a 24 horas
        let [hours, minutes, seconds] = time.split(':').map(Number);
        if (modifier === 'p. m.' && hours < 12) {
            hours += 12;
        } else if (modifier === 'a. m.' && hours === 12) {
            hours = 0;
        }

        // Crear la fecha en formato ISO y convertir a timestamp
        const date = new Date(year, month - 1, day, hours, minutes, seconds);
        return date.getTime();
    };

    // Ordenar el resultado por fecha y hora
    const sortedResult = result.sort((a, b) => {
        return getTimestamp(a.fecha, a.hora) - getTimestamp(b.fecha, b.hora);
    });

    // Imprimir el resultado ordenado en la consola
    var nuev = [];
    sortedResult.forEach(item => {
      ordenes.forEach(item2 => {
        if(item.fecha == item2.fecha && item.hora == item2.hora)
        {
          nuev.push(item2); // Por ejemplo, imprimir la orden
        }
        // Aquí puedes hacer algo con cada orden
        
    });
      // Aquí puedes hacer algo con cada orden
     
  });

    


    return nuev;
}

}
