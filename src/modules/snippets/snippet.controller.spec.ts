import { Test } from '@nestjs/testing';
import { SnippetService } from './snippet.service';

class SnippetController {
  constructor(private readonly snippetService: SnippetService) {}

  async create(data: { text: string }) {
    return this.snippetService.create(data);
  }
}

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

    controller = new SnippetController(mockSnippetService as any);
    snippetService = mockSnippetService;
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
