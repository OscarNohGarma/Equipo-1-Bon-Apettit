import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseCitasService } from './firebase-citas.service';

describe('FirebaseCitasService', () => {
  let service: FirebaseCitasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseCitasService],
    }).compile();

    service = module.get<FirebaseCitasService>(FirebaseCitasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
