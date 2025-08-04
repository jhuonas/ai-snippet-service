import { Test, TestingModule } from '@nestjs/testing';
import { SnippetService } from './snippet.service';
import { PrismaService } from '../database/prisma/prisma.service';
import { AiService } from '../ai/ai.service';

describe('SnippetService', () => {
  let service: SnippetService;
  let prismaService: any;
  let aiService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      snippet: {
        create: jest.fn().mockResolvedValue({
          id: '123',
          text: 'Example text',
          summary: 'Short summary',
          createdAt: new Date(),
        }),
        findMany: jest.fn().mockResolvedValue([
          {
            id: '1',
            text: 'Snippet 1',
            summary: 'Summary 1',
            createdAt: new Date(),
          },
          {
            id: '2',
            text: 'Snippet 2',
            summary: 'Summary 2',
            createdAt: new Date(),
          },
        ]),
        count: jest.fn().mockResolvedValue(2),
      },
    };

    const mockAiService = {
      summarize: jest.fn().mockResolvedValue('Short summary'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnippetService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
      ],
    }).compile();

    service = module.get<SnippetService>(SnippetService);
    prismaService = module.get<PrismaService>(PrismaService);
    aiService = module.get<AiService>(AiService);
  });

  describe('create', () => {
    it('should create and persist a snippet using Prisma', async () => {
      const result = await service.create({ text: 'Example text' });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('summary');
      expect(prismaService.snippet.create).toHaveBeenCalledWith({
        data: {
          text: 'Example text',
          summary: 'Short summary',
        },
      });
    });

    it('should call the AI service to generate a summary', async () => {
      await service.create({ text: 'Example text' });

      expect(aiService.summarize).toHaveBeenCalledWith('Example text');
    });
  });

  describe('findAll', () => {
    it('should return paginated snippets with default values when no params provided', async () => {
      const result = await service.findAll({});

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('take');
      expect(result).toHaveProperty('skip');
      expect(result.data).toHaveLength(2);
      expect(result.take).toBe(10);
      expect(result.skip).toBe(0);
      expect(result.total).toBe(2);

      expect(prismaService.snippet.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      });
      expect(prismaService.snippet.count).toHaveBeenCalled();
    });

    it('should return exactly 5 records starting from the 3rd when take=5 and skip=2', async () => {
      const mockSnippets = [
        {
          id: '3',
          text: 'Snippet 3',
          summary: 'Summary 3',
          createdAt: new Date(),
        },
        {
          id: '4',
          text: 'Snippet 4',
          summary: 'Summary 4',
          createdAt: new Date(),
        },
        {
          id: '5',
          text: 'Snippet 5',
          summary: 'Summary 5',
          createdAt: new Date(),
        },
        {
          id: '6',
          text: 'Snippet 6',
          summary: 'Summary 6',
          createdAt: new Date(),
        },
        {
          id: '7',
          text: 'Snippet 7',
          summary: 'Summary 7',
          createdAt: new Date(),
        },
      ];

      prismaService.snippet.findMany.mockResolvedValue(mockSnippets);
      prismaService.snippet.count.mockResolvedValue(10);

      const result = await service.findAll({ take: 5, skip: 2 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('take');
      expect(result).toHaveProperty('skip');
      expect(result.data).toHaveLength(5);
      expect(result.take).toBe(5);
      expect(result.skip).toBe(2);
      expect(result.total).toBe(10);

      expect(prismaService.snippet.findMany).toHaveBeenCalledWith({
        take: 5,
        skip: 2,
        orderBy: { createdAt: 'desc' },
      });
      expect(prismaService.snippet.count).toHaveBeenCalled();
    });

    it('should return empty array when no snippets exist', async () => {
      prismaService.snippet.findMany.mockResolvedValue([]);
      prismaService.snippet.count.mockResolvedValue(0);

      const result = await service.findAll({});

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.take).toBe(10);
      expect(result.skip).toBe(0);

      expect(prismaService.snippet.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      });
      expect(prismaService.snippet.count).toHaveBeenCalled();
    });

    it('should handle pagination when total is less than take', async () => {
      const mockSnippets = [
        {
          id: '1',
          text: 'Snippet 1',
          summary: 'Summary 1',
          createdAt: new Date(),
        },
      ];

      prismaService.snippet.findMany.mockResolvedValue(mockSnippets);
      prismaService.snippet.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.take).toBe(10);
      expect(result.skip).toBe(0);

      expect(prismaService.snippet.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      });
      expect(prismaService.snippet.count).toHaveBeenCalled();
    });

    it('should order snippets by createdAt in descending order', async () => {
      await service.findAll({});

      expect(prismaService.snippet.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle edge case with take=0', async () => {
      prismaService.snippet.findMany.mockResolvedValue([]);
      prismaService.snippet.count.mockResolvedValue(0);

      const result = await service.findAll({ take: 0 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toHaveLength(0);
      expect(result.take).toBe(0);

      expect(prismaService.snippet.findMany).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle edge case with skip=0', async () => {
      await service.findAll({ skip: 0 });

      expect(prismaService.snippet.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
