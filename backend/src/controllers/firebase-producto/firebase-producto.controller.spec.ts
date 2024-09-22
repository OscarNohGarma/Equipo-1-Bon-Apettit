import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseProductoController } from './firebase-producto.controller';

describe('FirebaseProductoController', () => {
  let controller: FirebaseProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseProductoController],
    }).compile();

    controller = module.get<FirebaseProductoController>(FirebaseProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
