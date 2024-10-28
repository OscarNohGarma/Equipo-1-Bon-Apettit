import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseComprobanteController } from './firebase-comprobante.controller';

describe('FirebaseComprobanteController', () => {
  let controller: FirebaseComprobanteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseComprobanteController],
    }).compile();

    controller = module.get<FirebaseComprobanteController>(FirebaseComprobanteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
