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
    async findAll2(): Promise<ProductoEntity[]> {
      const productos: ProductoEntity[] = await this.findAll();
      console.log(productos);
      return productos;
    }
  
  
    findOne(id: number): Promise<ProductoEntity> {
      return this.productoRepository.findOneBy({ id });
    }

    findByName(name: string): Promise<ProductoEntity> {
      return this.productoRepository.findOne({ where: { namee: name } });
    }

    async remove(id: string): Promise<void> {
      await this.productoRepository.delete(id);
    }
    async removeByName(namee: string): Promise<void> {
      const producto = await this.productoRepository.findOne({ where: { namee: namee } });
      if (producto) {
        await this.productoRepository.remove(producto);
      } else {
        console.log(`Producto con nombre ${namee} no encontrado.`);
      }
    }
   
    async editProducto(id: number, producto: ProductoEntity): Promise<ProductoEntity> {
      
      const updatedProducto = await this.productoRepository.findOneBy({id});
      let update = Object.assign(updatedProducto,producto);
      const productoactualizado = await this.productoRepository.save(updatedProducto)
      return updatedProducto;

    }

    async editProductoByName(namee: string,  producto: ProductoEntity): Promise<ProductoEntity> {
      const updatedProducto = await this.productoRepository.findOne({ where: { namee: namee } });
      let update = Object.assign(updatedProducto,producto);
      const productoactualizado = await this.productoRepository.save(updatedProducto)
      return updatedProducto;
      
    }
    
      
}
