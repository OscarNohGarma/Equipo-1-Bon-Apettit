import { Test, TestingModule } from '@nestjs/testing';
import { FireAuthController } from './fire-auth.controller';

describe('FireAuthController', () => {
  let controller: FireAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FireAuthController],
    }).compile();

    controller = module.get<FireAuthController>(FireAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
