import { Injectable } from '@nestjs/common';
import { ProductoDto } from 'src/interface/producto.interface';
import { ProductoEntity } from 'src/producto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(ProductoEntity)
    private productoRepository: Repository<ProductoEntity>,
  ) {}
    async addProducto(produc: ProductoDto): Promise<any> {
      let item = new ProductoEntity();
      item.namee = produc.namee;
      item.imagen = produc.image;
      item.precio = produc.precio;
      item.categoria = produc.categoria;
      const newInfante = await this.productoRepository.save(item);
      return newInfante;
    }
    findAll(): Promise<ProductoEntity[]> {
      return this.productoRepository.find();
    }
  
    findOne(id: number): Promise<ProductoEntity> {
      return this.productoRepository.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
      await this.productoRepository.delete(id);
    }
   
    async editProducto(id: number, producto: ProductoEntity): Promise<ProductoEntity> {
      
      const updatedProducto = await this.productoRepository.findOneBy({id});
      let update = Object.assign(updatedProducto,producto);
      const productoactualizado = await this.productoRepository.save(updatedProducto)
      return updatedProducto;

    }
    
      
}
