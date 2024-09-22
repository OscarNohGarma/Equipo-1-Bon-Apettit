import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { Menu } from 'src/document/modelmenu';
import { FirebaseProductoService } from 'src/services/firebase_producto/firebase_producto.service';

@Controller('firebase/menu')
export class FirebaseProductoController {
    constructor(private readonly menuService: FirebaseProductoService) {}


    @Post('/addmenu')
    async createNewMenu(@Body() newmenu: Menu) {
      const men = await this.menuService.createMenu(newmenu);
      return { message: 'Menu creada con éxito' };
    }
  
  
    @Get('/getmenu')
    async getAllInstitutions() {
      const men = await this.menuService.getAllMenu();
      return men;
    }
    
    @Get('/getmenu/:id')
    async getMenuById(@Param('id') menuId: string) {
      const men = await this.menuService.getMenuById(menuId);
      return men;
    }

    @Delete('/deletemenu/:id')
  async deleteMenuById(@Param('id') menId: string) {
    await this.menuService.deleteMenuById(menId);
    return { message: 'Menu eliminada con éxito' };
  }

  @Put('/updatemenu/:id')
  async updateMenu(@Param('id') menId: string, @Body() updatedmen: Menu) {
    const updatedMenuName = await this.menuService.updateMenuName(menId, updatedmen);
    return { message: 'Menu actualizada con éxito'};
  }   
}
