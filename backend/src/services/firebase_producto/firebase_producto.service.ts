import { CollectionReference, DocumentData, DocumentSnapshot, QuerySnapshot  } from '@google-cloud/firestore';
import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
import { Menu } from 'src/document/modelos';
import { ModeloPrincipal } from 'src/document/modelo_principal';
//import { Menu } from 'src/document/modelmenu';

@Injectable()
export class FirebaseProductoService {
  constructor(
    @Inject(ModeloPrincipal.collectionName)
    private readonly defaultCollection: CollectionReference<ModeloPrincipal>,
  ) {}

  // Método genérico para crear una entidad (Menu o Cita)
  async createEntity(entity: ModeloPrincipal, collectionName: string): Promise<any> {
    const collection = this.getCollection(collectionName);

    if (!entity || !entity.namee) {
      throw new BadRequestException('Se requiere un nombre');
    }

    const nameQuerySnapshot: QuerySnapshot = await collection.where('namee', '==', entity.namee).get();
    if (!nameQuerySnapshot.empty) {
      throw new ConflictException('La entidad ya está registrada');
    }

    const doc = await collection.doc();
    entity.id = doc.id;  // Asigna un nuevo ID a la entidad
    await collection.doc(doc.id).set(entity);
    return entity;
  }

  // Método genérico para obtener todas las entidades
  async getAllEntities(collectionName: string): Promise<any[]> {
    const collection = this.getCollection(collectionName);
    const snapshot: QuerySnapshot = await collection.get();
    return snapshot.docs.map((doc) => doc.data());
  }

  // Método genérico para obtener una entidad por ID
  async getEntityById(entityId: string, collectionName: string): Promise<any> {
    const collection = this.getCollection(collectionName);
    const entityDoc: DocumentSnapshot = await collection.doc(entityId).get();
    if (!entityDoc.exists) {
      throw new ConflictException('Entidad no encontrada');
    }
    return entityDoc.data();
  }

  // Método genérico para eliminar una entidad por ID
  async deleteEntityById(entityId: string, collectionName: string): Promise<void> {
    const collection = this.getCollection(collectionName);
    const entityDoc: DocumentSnapshot = await collection.doc(entityId).get();
    if (!entityDoc.exists) {
      throw new ConflictException('Entidad no encontrada');
    }
    await collection.doc(entityId).delete();
  }

  // Método genérico para actualizar una entidad
  async updateEntity(entityId: string, updatedEntity: Partial<ModeloPrincipal>, collectionName: string): Promise<any> {
    const collection = this.getCollection(collectionName);
    const entityDoc: DocumentSnapshot = await collection.doc(entityId).get();
    if (!entityDoc.exists) {
      throw new ConflictException('Entidad no encontrada');
    }
    await collection.doc(entityId).update(updatedEntity);
    return { message: 'Entidad actualizada con éxito' };
  }

  // Método para obtener la colección correspondiente al nombre
  private getCollection(collectionName: string): CollectionReference<ModeloPrincipal> {
    // Puedes implementar un mapeo para tus colecciones aquí si es necesario
    return this.defaultCollection.firestore.collection(collectionName) as CollectionReference<ModeloPrincipal>;
  }
}