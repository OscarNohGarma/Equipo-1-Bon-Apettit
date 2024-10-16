import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseUsuarioController } from './firebase-usuario.controller';

describe('FirebaseUsuarioController', () => {
  let controller: FirebaseUsuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseUsuarioController],
    }).compile();

    controller = module.get<FirebaseUsuarioController>(FirebaseUsuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
