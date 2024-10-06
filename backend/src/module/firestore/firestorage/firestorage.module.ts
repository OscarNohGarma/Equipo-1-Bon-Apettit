import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { StorageService } from '../../../services/storage-service/storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'GCLOUD_STORAGE', // Define el proveedor GCLOUD_STORAGE
      useFactory: (configService: ConfigService) => {

        return new Storage({
          keyFilename: configService.get<string>('SA_KEY'),
        });
      },
      inject: [ConfigService], // Inyecta el ConfigService para obtener las credenciales
    },
    StorageService, // Asegúrate de que StorageService está en los providers
  ],
  exports: ['GCLOUD_STORAGE', StorageService], // Exporta GCLOUD_STORAGE y el servicio
})
export class FirestorageModule {}
