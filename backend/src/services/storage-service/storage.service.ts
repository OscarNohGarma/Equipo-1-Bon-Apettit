
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
@Injectable()
export class StorageService {
  private bucket;

  constructor(
    @Inject('GCLOUD_STORAGE') private readonly storage: Storage,
    private readonly configService: ConfigService,
  ) {
    const bucketName = this.configService.get<string>('BUCKET_NAME') || 'myweb-b3462.appspot.com';

    // Verifica que el bucketName no sea undefined o null
    if (!bucketName) {
      throw new Error('BUCKET_NAME no está configurado o es inválido');
    }

    // Asigna el bucket correctamente
    this.bucket = this.storage.bucket(bucketName);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer } = file;
    
    // Verifica que el bucket tiene el nombre correcto
    console.log('Nombre del bucket:', this.bucket.name);  // Esto debería mostrar el nombre correcto

    const blob = this.bucket.file(originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('finish', () => {
        // Asegúrate de que this.bucket.name tiene un valor válido aquí
        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.on('error', (err) => {
        reject(`Error uploading file: ${err.message}`);
      });

      blobStream.end(buffer);
    });
  }
  
  async deleteFile(fileName: string): Promise<void> {
    const file = this.bucket.file(fileName);
    const [exists] = await file.exists();

    if (!exists) {
      console.log(`El archivo ${fileName} no existe en el bucket.`);
    }

    await file.delete();
    console.log(`El archivo ${fileName} ha sido eliminado del bucket.`);
  }

  async getFile(fileName: string): Promise<string> {
    const file = this.bucket.file(fileName);
    const [exists] = await file.exists();

    if (!exists) {
      throw new Error('El archivo no existe');
    }

    const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
    return publicUrl; // Devuelve la URL pública del archivo
  }
}