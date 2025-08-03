import { Test, TestingModule } from '@nestjs/testing';
import { SnippetService } from './snippet.service';
import { PrismaService } from '../database/prisma/prisma.service';

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
});
