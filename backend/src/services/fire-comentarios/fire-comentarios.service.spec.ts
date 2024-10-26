import { Test, TestingModule } from '@nestjs/testing';
import { FireComentariosService } from './fire-comentarios.service';

describe('FireComentariosService', () => {
  let service: FireComentariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FireComentariosService],
    }).compile();

    service = module.get<FireComentariosService>(FireComentariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
