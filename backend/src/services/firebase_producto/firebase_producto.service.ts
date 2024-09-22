import { CollectionReference, DocumentData, DocumentSnapshot, QuerySnapshot  } from '@google-cloud/firestore';
import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { ProductoMenu } from 'src/document/menu.document';
import { Menu } from 'src/document/modelmenu';

@Injectable()
export class FirebaseProductoService {
    constructor( 
        @Inject(ProductoMenu.collectionName)
        private ProductoMenuCollection: CollectionReference<ProductoMenu>,
      ) {}
 
      async createMenu(menu : Menu): Promise<any> { 
        if (!menu || !menu.namee) {
            throw new BadRequestException('Se requiere un nombre del platllo');
        }
        
        const nameQuerySnapshot: QuerySnapshot = await this.ProductoMenuCollection.where('name', '==', menu.namee).get();
        if (!nameQuerySnapshot.empty) {
          throw new ConflictException('El menu ya esta registrada');
        }
        
        const doc = await this.ProductoMenuCollection.doc();
        const id = menu.id = doc.id;
        const surveys = {
          ...menu,
        };
        
        await this.ProductoMenuCollection.doc(menu.namee).set(surveys);
        return surveys;
      }

      async getAllMenu(): Promise<any[]> {
        const snapshot: QuerySnapshot = await this.ProductoMenuCollection.get();
        const menus = snapshot.docs.map((doc) => doc.data());
        return menus;
      }
    
      async getMenuById(menId: string): Promise<any> {
        const menDoc: DocumentSnapshot = await this.ProductoMenuCollection.doc(menId).get();
        if (!menDoc.exists) {
          throw new ConflictException('Menu no encontrada');
        }
        return menDoc.data();
      }
    
      async deleteMenuById(menId: string): Promise<void> {
        const menDoc: DocumentSnapshot = await this.ProductoMenuCollection.doc(menId).get();
        if (!menDoc.exists) {
          throw new ConflictException('Menu no encontrada');
        }
        await this.ProductoMenuCollection.doc(menId).delete();
      }
    
      async updateMenuName(menId: string, updatedMenuName: any): Promise<any> {
        const menDoc: DocumentSnapshot = await this.ProductoMenuCollection.doc(menId).get();
        if (!menDoc.exists) {
          throw new ConflictException('Menu no encontrada');
        }
        await this.ProductoMenuCollection.doc(menId).update(updatedMenuName);
        return { message: 'Nombre actualizado con éxito' };
      }
}
