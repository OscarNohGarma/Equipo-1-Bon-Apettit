import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseCitaController } from './firebase-cita.controller';

describe('FirebaseCitaController', () => {
  let controller: FirebaseCitaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseCitaController],
    }).compile();

    controller = module.get<FirebaseCitaController>(FirebaseCitaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
