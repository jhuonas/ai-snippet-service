import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SnippetController } from './snippet.controller';
import { SnippetService } from './snippet.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';

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

      const result = await validationPipe.transform(dto, {
        type: 'body',
        metatype: CreateSnippetDto,
      });

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
