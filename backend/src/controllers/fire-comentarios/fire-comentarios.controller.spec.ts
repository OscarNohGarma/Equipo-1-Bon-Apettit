import { Test, TestingModule } from '@nestjs/testing';
import { FireComentariosController } from './fire-comentarios.controller';

describe('FireComentariosController', () => {
  let controller: FireComentariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FireComentariosController],
    }).compile();

    controller = module.get<FireComentariosController>(FireComentariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
