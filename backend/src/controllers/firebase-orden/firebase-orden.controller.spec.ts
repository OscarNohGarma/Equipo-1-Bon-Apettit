import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseOrdenController } from './firebase-orden.controller';

describe('FirebaseOrdenController', () => {
  let controller: FirebaseOrdenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseOrdenController],
    }).compile();

    controller = module.get<FirebaseOrdenController>(FirebaseOrdenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
