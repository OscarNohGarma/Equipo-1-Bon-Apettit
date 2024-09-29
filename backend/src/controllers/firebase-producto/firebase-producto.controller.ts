import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
//import { Menu } from 'src/document/modelmenu';
import { FirebaseProductoService } from 'src/services/firebase_producto/firebase_producto.service';


import { ref, uploadBytes } from 'firebase/storage';

import { Menu } from 'src/document/modelos';
import { Rutas, Tiporuta } from 'src/module/global.var';
import { Citas } from 'src/document/modelos';

@Controller('firebase')
export class FirebaseProductoController {
   
    
    constructor(private readonly servicio: FirebaseProductoService) {
      

      
    }
    // Métodos para Menu
    @Post('/menu/addmenu')
    async createNewMenu(@Body() newMenu: Menu): Promise<{ message: string; }> {

        await this.servicio.createEntity(newMenu, "menu");
        return { message: 'Menu creada con éxito' };
    }

    @Get('/menu/getmenu')
    async getAllMenus() {
        const menus = await this.servicio.getAllEntities("menu");
        return menus;
    }

    @Get('/menu/getmenu/:id')
    async getMenuById(@Param('id') menuId: string) {
        const menu = await this.servicio.getEntityById(menuId,"menu");
        return menu;
    }

    @Delete('/menu/deletemenu/:id')
    async deleteMenuById(@Param('id') menuId: string) {
        await this.servicio.deleteEntityById(menuId,"menu");
        return { message: 'Menu eliminada con éxito' };
    }

    @Put('/menu/updatemenu/:id')
    async updateMenu(@Param('id') menuId: string, @Body() updatedMenu: Menu) {
        await this.servicio.updateEntity(menuId, updatedMenu,"menu");
        return { message: 'Menu actualizada con éxito' };
    }
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
