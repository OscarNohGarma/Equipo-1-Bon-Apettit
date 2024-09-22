import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';


@Entity('menu')
export class ProductoEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  namee: string;

  @Column()
  imagen: string;
  
  @Column()
  precio: string;

  @Column()
  categoria: string;

}