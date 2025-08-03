import { Test, TestingModule } from '@nestjs/testing';
import { SnippetService } from './snippet.service';
import { PrismaService } from '../database/prisma/prisma.service';

class AiService {
  summarize(text: string): Promise<string> {
    return Promise.resolve('stub');
  }
}

describe('SnippetService', () => {
  let service: SnippetService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnippetService,
        {
          provide: PrismaService,
          useValue: {
            snippet: {
              create: jest.fn().mockImplementation((data) => ({
                ...data.data,
                id: 'mock-id',
                createdAt: new Date(),
              })),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SnippetService>(SnippetService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create and persist a snippet using Prisma', async () => {
    const snippet = await service.create({ text: 'Text for summary' });

    expect(snippet.id).toBeDefined();
    expect(snippet.text).toBe('Text for summary');
    expect(snippet.summary).toBeDefined();
    expect(prisma.snippet.create).toHaveBeenCalled();
  });

  it('should call the AI service to generate a summary', async () => {
    const mockAiService = {
      summarize: jest.fn().mockResolvedValue('Mocked summary from AI'),
    };

    const mockPrisma = {
      snippet: {
        create: jest.fn().mockImplementation((data) => ({
          ...data.data,
          id: 'mock-id',
          createdAt: new Date(),
        })),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        SnippetService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AiService, useValue: mockAiService },
      ],
    }).compile();

    const service = module.get<SnippetService>(SnippetService);

    const result = await service.create({ text: 'This is the raw content.' });

    expect(mockAiService.summarize).toHaveBeenCalledWith(
      'This is the raw content.',
    );
    expect(result.summary).toBe('Mocked summary from AI');
  });
});
