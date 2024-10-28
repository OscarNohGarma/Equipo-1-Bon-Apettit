import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage-service/storage.service';

@Injectable()
export class FirebaseComprobanteService extends StorageService{}
