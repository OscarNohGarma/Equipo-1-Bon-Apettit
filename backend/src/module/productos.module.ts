/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from 'src/controllers/productos/productos.controller';
import { ProductoEntity } from 'src/producto.entity';
import { ProductosService } from 'src/services/productos/productos.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductoEntity])],
    controllers: [ProductosController],
    providers: [ProductosService],
})
export class ProductosModule {}
