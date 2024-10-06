import { Controller,Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { Citas } from 'src/document/modelos';
import { FirebaseCitasService } from 'src/services/firebase-citas/firebase-citas.service';


@Controller('firebase')
export class FirebaseCitaController {

    constructor(private readonly servicio: FirebaseCitasService) {}
    // Métodos para Citas
  @Post('/cita/addcita')
  async createNewCita(@Body() newCita: Citas): Promise<{ message: string; }> {
      await this.servicio.createEntity(newCita, "citas");
      return { message: 'Cita creada con éxito' };
  }

  @Get('/cita/getcita')
  async getAllCitas() {
      const citas = await this.servicio.getAllEntities("citas");
      return citas;
  }

  @Get('/cita/getcita/:id')
  async getCitaById(@Param('id') citaId: string) {
      const cita = await this.servicio.getEntityById(citaId,"citas");
      return cita;
  }

  @Delete('/cita/deletecita/:id')
  async deleteCitaById(@Param('id') citaId: string) {
      await this.servicio.deleteEntityById(citaId,"citas");
      return { message: 'Cita eliminada con éxito' };
  }

  @Put('/cita/updatecita/:id')
  async updateCita(@Param('id') citaId: string, @Body() updatedCita: Citas) {
      await this.servicio.updateEntity(citaId, updatedCita,"citas");
      return { message: 'Cita actualizada con éxito' };
  }

  
}



