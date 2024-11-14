import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ModeloPrincipal } from 'src/document/modelo_principal';
import { FirebaseGenericService } from 'src/services/firebase_generic/firebase_generic.service';

@Controller('firebase')
export class GenericFirebaseController {
    protected collectionName: string;
    
  
  constructor(
    private readonly firebaseService: FirebaseGenericService,
  ) {
    this.collectionName = "bs";
    
  }

  @Post('')
  async createNewEntity(@Body() newEntity: ModeloPrincipal): Promise<{ message: string, id: string }> {
    
    await this.firebaseService.createEntity(newEntity, this.collectionName);
    return { message: 'Entidad creada con éxito', id: newEntity.id };
  }

  @Get('')
  async getAllEntities() {
    return await this.firebaseService.getAllEntities(this.collectionName);
  }

  @Get('/:id')
  async getEntityById(@Param('id') entityId: string) {
    return await this.firebaseService.getEntityById(entityId, this.collectionName);
  }

  @Delete('/:id')
  async deleteEntityById(@Param('id') entityId: string) {

    await this.firebaseService.deleteEntityById(entityId, this.collectionName);
    return { message: 'Entidad eliminada con éxito' };
  }

  @Put('/:id')
  async updateEntity(@Param('id') entityId: string, @Body() updatedEntity: ModeloPrincipal) {
    
    await this.firebaseService.updateEntity(entityId, updatedEntity, this.collectionName);
    return { message: 'Entidad actualizada con éxito' };
  }
}
