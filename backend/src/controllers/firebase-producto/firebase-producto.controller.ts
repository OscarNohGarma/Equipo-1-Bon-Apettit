import { Controller, Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { Menu } from 'src/document/modelos';
import { FirebaseMenuService } from 'src/services/firebase_menu/firebase_menu.service';

@Controller('firebase')
export class FirebaseProductoController {
   
    
    constructor(private readonly servicio: FirebaseMenuService) {}
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
}
