import { Controller, Get } from '@nestjs/common';
import { GenericFirebaseController } from '../generic/generic.controller';
import { FireComentariosService } from 'src/services/fire-comentarios/fire-comentarios.service';

@Controller('comentario')
export class FireComentariosController extends GenericFirebaseController{
    constructor(private readonly servicio: FireComentariosService) {
        super(servicio); // Llama al constructor de la clase padre
        this.collectionName = "comentario"; // Asigna el nombre de colección específico para esta clase
      }

      @Get('')
      async getAllEntities() {
          const ordenes = await this.servicio.getAllEntities('comentario');
      
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
      
          
      
      
          return nuev.reverse();
      }
}
