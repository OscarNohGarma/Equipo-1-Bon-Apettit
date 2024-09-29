import { Controller, Delete, Get, Post,Param, Body, Put } from '@nestjs/common';
import { ProductoDto } from 'src/interface/producto.interface';
import { ProductoEntity } from 'src/producto.entity';
import { ProductosService } from 'src/services/productos/productos.service';

@Controller('mysql/menu')
export class ProductosController {
    constructor(private readonly producServices: ProductosService) { }

    //obtener
    @Get("/getmenu")
    async findAll(): Promise<ProductoEntity[]> {
      return await this.producServices.findAll();
    }
    //obtener uno
    
  @Get('/getmenuid/:id')
  async findOne(@Param('id') id: number): Promise<ProductoEntity> {
    return await this.producServices.findOne(id);
  }

  @Get('/getmenu/:namee')
  async findByName(@Param('namee') name: string): Promise<ProductoEntity> {
    return await this.producServices.findByName(name);
  }

    //agregar
    @Post('/addmenu')
    async AddInfantePsicomotor(@Body() produ: ProductoDto){
      const men = await this.producServices.addProducto(produ);
      return { message: 'Menu creada con éxito' };
    }

    //eliminar
    @Delete('/deletemenuid/:id')
    async delete(@Param() params) {
      return this.producServices.remove(params.id);
    }
    @Delete('/deletemenu/:namee')
    async deleteByName(@Param('namee') name: string){
      await this.producServices.removeByName(name);
      return { message: 'Menu eliminada con éxito' };
    }

    //actualizar
    @Put('/updatemenuid/:id')
    async actualizar(@Param() params,@Body() produ: ProductoEntity) {
      return await this.producServices.editProducto(params.id, produ)
    }

    @Put('/updatemenu/:namee')
    async actualizarPorNombre(@Param('namee') name: string, @Body() produ: ProductoEntity) {
      const updatedMenuName = await this.producServices.editProductoByName(name, produ);
      return { message: 'Menu actualizada con éxito'};
    }

}
