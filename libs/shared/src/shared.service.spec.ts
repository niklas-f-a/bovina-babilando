import { Test, TestingModule } from '@nestjs/testing';
import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedService],
    }).compile();

    service = module.get<SharedService>(SharedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return funkar /Testing workflow remove later/', () => {
    expect(service.testRmLater()).toBe('funkar');
  });
});
