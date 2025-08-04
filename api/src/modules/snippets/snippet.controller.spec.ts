import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SnippetController } from './snippet.controller';
import { SnippetService } from './snippet.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';

describe('SnippetController', () => {
  let controller: SnippetController;
  let snippetService: SnippetService;

  beforeEach(async () => {
    const mockSnippetService = {
      create: jest.fn().mockResolvedValue({
        id: '123',
        text: 'Example text',
        summary: 'Short summary',
        createdAt: new Date(),
      }),
      findAll: jest.fn().mockResolvedValue({
        data: [
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
        ],
        total: 2,
        take: 10,
        skip: 0,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
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

  describe('POST /snippets', () => {
    it('should create a snippet with valid text', async () => {
      const createSnippetDto: CreateSnippetDto = { text: 'Example text' };
      const result = await controller.create(createSnippetDto);

      expect(result).toHaveProperty('id');
      expect(result.summary).toBeDefined();
      expect(snippetService.create).toHaveBeenCalledWith(createSnippetDto);
    });

    it('should create a snippet with exactly 1000 characters', async () => {
      const longText = 'a'.repeat(1000);
      const createSnippetDto: CreateSnippetDto = { text: longText };
      const result = await controller.create(createSnippetDto);

      expect(result).toHaveProperty('id');
      expect(snippetService.create).toHaveBeenCalledWith(createSnippetDto);
    });
  });

  describe('GET /snippets', () => {
    it('should return first 10 snippets when no pagination params are provided', async () => {
      const result = await controller.findAll({});

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('take');
      expect(result).toHaveProperty('skip');
      expect(result.data).toHaveLength(2);
      expect(result.take).toBe(10);
      expect(result.skip).toBe(0);
      expect(snippetService.findAll).toHaveBeenCalledWith({});
    });

    it('should return exactly 5 records starting from the 3rd when take=5 and skip=2', async () => {
      const mockServiceResponse = {
        data: [
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
        ],
        total: 10,
        take: 5,
        skip: 2,
      };

      snippetService.findAll.mockResolvedValue(mockServiceResponse);

      const result = await controller.findAll({ take: 5, skip: 2 });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('take');
      expect(result).toHaveProperty('skip');
      expect(result.data).toHaveLength(5);
      expect(result.take).toBe(5);
      expect(result.skip).toBe(2);
      expect(result.total).toBe(10);
      expect(snippetService.findAll).toHaveBeenCalledWith({
        take: 5,
        skip: 2,
      });
    });

    it('should return empty array when no snippets exist', async () => {
      const mockServiceResponse = {
        data: [],
        total: 0,
        take: 10,
        skip: 0,
      };

      snippetService.findAll.mockResolvedValue(mockServiceResponse);

      const result = await controller.findAll({});

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(snippetService.findAll).toHaveBeenCalledWith({});
    });

    it('should handle pagination when total is less than take', async () => {
      const mockServiceResponse = {
        data: [
          {
            id: '1',
            text: 'Snippet 1',
            summary: 'Summary 1',
            createdAt: new Date(),
          },
        ],
        total: 1,
        take: 10,
        skip: 0,
      };

      snippetService.findAll.mockResolvedValue(mockServiceResponse);

      const result = await controller.findAll({});

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(snippetService.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('DTO validation', () => {
    let validationPipe: ValidationPipe;

    beforeEach(() => {
      validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      });
    });

    it('should validate CreateSnippetDto with valid data', async () => {
      const dto = new CreateSnippetDto();
      dto.text = 'Valid text';

      const result = (await validationPipe.transform(dto, {
        type: 'body',
        metatype: CreateSnippetDto,
      })) as CreateSnippetDto;

      expect(result).toBeInstanceOf(CreateSnippetDto);
      expect(result.text).toBe('Valid text');
    });

    it('should throw BadRequestException for empty text', async () => {
      const dto = new CreateSnippetDto();
      dto.text = '';

      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for text longer than 1000 characters', async () => {
      const dto = new CreateSnippetDto();
      dto.text = 'a'.repeat(1001);

      await expect(
        validationPipe.transform(dto, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-string text', async () => {
      const invalidDto = { text: 123 };

      await expect(
        validationPipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for missing text', async () => {
      const invalidDto = {};

      await expect(
        validationPipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
