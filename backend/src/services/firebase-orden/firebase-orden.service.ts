import { Injectable } from '@nestjs/common';
import { FirebaseGenericService } from '../firebase_generic/firebase_generic.service';

@Injectable()
export class FirebaseOrdenService extends FirebaseGenericService{}
