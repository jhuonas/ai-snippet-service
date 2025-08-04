import { Test } from '@nestjs/testing';
import { SnippetController } from './snippet.controller';
import { SnippetService } from './snippet.service';

describe('SnippetController', () => {
  let controller: SnippetController;
  let snippetService: any;

  beforeEach(async () => {
    const mockSnippetService = {
      create: jest.fn().mockResolvedValue({
        id: '123',
        text: 'Example text',
        summary: 'Short summary',
        createdAt: new Date(),
      }),
    };

    const module = await Test.createTestingModule({
      controllers: [SnippetController],
      providers: [
        {
          provide: SnippetService,
          useValue: mockSnippetService,
        },
      ],
    }).compile();

    controller = module.get<SnippetController>(SnippetController);
    snippetService = module.get<SnippetService>(SnippetService);
  });

  it('should create a snippet via POST', async () => {
    const result = await controller.create({ text: 'Example text' });

    expect(result).toHaveProperty('id');
    expect(result.summary).toBeDefined();
    expect(snippetService.create).toHaveBeenCalledWith({
      text: 'Example text',
    });
  });
});
