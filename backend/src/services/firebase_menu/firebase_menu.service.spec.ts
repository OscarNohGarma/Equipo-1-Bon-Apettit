import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseMenuService } from './firebase_menu.service';

describe('FirebaseMenuService', () => {
  let service: FirebaseMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseMenuService],
    }).compile();

    service = module.get<FirebaseMenuService>(FirebaseMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
