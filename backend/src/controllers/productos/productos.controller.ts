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
    
    @Get('/getmenu/:id')
  async findOne(@Param('id') id: number): Promise<ProductoEntity> {
    return await this.producServices.findOne(id);
  }

    //agregar
    @Post('/addmenu')
    async AddInfantePsicomotor(@Body() produ: ProductoDto): Promise<ProductoEntity>{
        return await this.producServices.addProducto(produ);
    }

    //eliminar
    @Delete('/deletemenu/:id')
    async delete(@Param() params) {
      return this.producServices.remove(params.id);
    }

    //actualizar
    @Put('/updatemenu/:id')
    async actualizar(@Param() params,@Body() produ: ProductoEntity) {
      return await this.producServices.editProducto(params.id, produ)
    }

}
