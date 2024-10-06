import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseOrdenService } from './firebase-orden.service';

describe('FirebaseOrdenService', () => {
  let service: FirebaseOrdenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseOrdenService],
    }).compile();

    service = module.get<FirebaseOrdenService>(FirebaseOrdenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
