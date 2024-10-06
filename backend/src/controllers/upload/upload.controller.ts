
import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../services/storage-service/storage.service';

@Controller('firebase/upload')
export class UploadController {
  constructor(private readonly storageService: StorageService) {}

  @Post("/addimg")
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{ message: string }> {
    const url = await this.storageService.uploadFile(file);
    return { message: `Archivo se agrego correctamente` };
  }

  @Get('/getimg/:fileName')
  async getFile(@Param('fileName') fileName: string): Promise<{ url: string }> {
    const url = await this.storageService.getFile(fileName);
    return { url }; // Aquí devuelves la URL del archivo
  }

  @Delete('/deleteimg/:fileName') // Asegúrate de que Delete esté importado
  async deleteFile(@Param('fileName') fileName: string): Promise<{ message: string }> {
    await this.storageService.deleteFile(fileName);
    return { message: `Archivo ${fileName} eliminado correctamente` };
  }
}