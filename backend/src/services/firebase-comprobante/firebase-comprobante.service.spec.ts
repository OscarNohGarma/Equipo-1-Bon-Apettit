import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseComprobanteService } from './firebase-comprobante.service';

describe('FirebaseComprobanteService', () => {
  let service: FirebaseComprobanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseComprobanteService],
    }).compile();

    service = module.get<FirebaseComprobanteService>(FirebaseComprobanteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
