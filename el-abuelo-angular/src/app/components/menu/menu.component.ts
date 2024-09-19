import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../../interface/products';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  selectedCategory: string = 'TODOS'; // Categoría por defecto
  isMenuOpen: boolean = false; // Para controlar la visibilidad del menú desplegable


  listProducts: Product[] = [] //////
  comida1 : string = "vacio"; /////////
  id: number; ///////////

  constructor(private _serviceproduct: ProductoService, private aRouter: ActivatedRoute){
    this.id = Number(aRouter.snapshot.paramMap.get('id'))
    console.log(this.id)

  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.isMenuOpen = false; // Cierra el menú después de seleccionar una opción
  }
  //OBTIENE LOS PRODUCTOS
  getListProduct(){
    this._serviceproduct.getProductos().subscribe(data => {
      console.log(data);
      this.listProducts =data;
      
    }, error => {
      console.log(error);
    })
  
   
  }
  //ELiminar producto
  deleteProduct(id:number){
    this._serviceproduct.deleteProductos(id).subscribe(() => {
      //this.getListProduct();
    }, error => {
      console.log(error);
    })
  }

  //AGREGAR O ACTUALIZAR PRODUCTOS
  addProducto(){
    const products: Product = {
      namee: "",
      descripcion:  "",
      precio: 0,
      stock: 0,
    }

    //Actualiza
    if(this.id != 0){
      products.id = this.id
      this._serviceproduct.updateProduct(this.id, products).subscribe(() => {
        
      }, error => {
        console.log(error);
      })
    }
    //Agrega
    else{
      this._serviceproduct.saveProductos(products).subscribe(() => {
        
      }, error => {
        console.log(error);
      })
    }
  }
  

  
  ngOnInit(): void {
    this.getListProduct();
    for (let i = 0; i < this.listProducts.length; i++) {
      const item = this.listProducts[i];
      if(i==0){
        this.comida1 = item.namee
      }
      //console.log(`ID: ${item.id}, Name: ${item.namee}`);
    }
    
  }
}
