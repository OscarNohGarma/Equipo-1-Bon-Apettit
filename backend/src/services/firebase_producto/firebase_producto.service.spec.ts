import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseProductoService } from './firebase_producto.service';

describe('FirebaseProductoService', () => {
  let service: FirebaseProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseProductoService],
    }).compile();

    service = module.get<FirebaseProductoService>(FirebaseProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
