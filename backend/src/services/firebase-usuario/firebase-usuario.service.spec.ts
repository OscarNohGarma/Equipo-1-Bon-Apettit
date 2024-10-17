import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseUsuarioService } from './firebase-usuario.service';

describe('FirebaseUsuarioService', () => {
  let service: FirebaseUsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseUsuarioService],
    }).compile();

    service = module.get<FirebaseUsuarioService>(FirebaseUsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
