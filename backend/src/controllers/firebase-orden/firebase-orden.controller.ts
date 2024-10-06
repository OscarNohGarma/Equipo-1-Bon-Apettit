import { Controller,Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { Orden } from 'src/document/modelos';
import { FirebaseOrdenService } from 'src/services/firebase-orden/firebase-orden.service';

@Controller('firebase')
export class FirebaseOrdenController {

    constructor(private readonly servicio: FirebaseOrdenService){}

     // Métodos para Orden
  @Post('/orden/addorden')
  async createNewOrden(@Body() newOrden: Orden): Promise<{ message: string; }> {
      await this.servicio.createEntity(newOrden, "orden");
      return { message: 'Orden creada con éxito' };
  }

  @Get('/orden/getorden')
  async getAllOrden() {
      const orden = await this.servicio.getAllEntities("orden");
      return orden;
  }

  @Get('/orden/getorden/:id')
  async getOrdenById(@Param('id') ordenId: string) {
      const orden = await this.servicio.getEntityById(ordenId,"orden");
      return orden;
  }

  @Delete('/orden/deleteorden/:id')
  async deleteOrdenById(@Param('id') ordenId: string) {
      await this.servicio.deleteEntityById(ordenId,"orden");
      return { message: 'Orden eliminada con éxito' };
  }

  @Put('/orden/updateorden/:id')
  async updateOrden(@Param('id') ordenId: string, @Body() updatedOrden: Orden) {
      await this.servicio.updateEntity(ordenId, updatedOrden,"orden");
      return { message: 'Orden actualizada con éxito' };
  }
}
