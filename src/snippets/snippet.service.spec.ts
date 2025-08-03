import { Test, TestingModule } from '@nestjs/testing';
import { SnippetService } from './snippet.service';

describe('SnippetService', () => {
  let service: SnippetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnippetService],
    }).compile();

    service = module.get<SnippetService>(SnippetService);
  });

  it('should create a snippet with summary', async () => {
    const snippet = await service.create({ text: 'This is an example text.' });

    expect(snippet).toHaveProperty('id');
    expect(snippet).toHaveProperty('summary');
    expect(snippet.summary).toContain('example');
  });
});
