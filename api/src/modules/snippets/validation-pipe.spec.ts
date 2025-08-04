import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { CreateSnippetDto } from './dto/create-snippet.dto';

describe('ValidationPipe Integration', () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  describe('CreateSnippetDto validation', () => {
    it('should transform valid data', async () => {
      const rawData = { text: 'Valid text for testing' };

      const result = await validationPipe.transform(rawData, {
        type: 'body',
        metatype: CreateSnippetDto,
      });

      expect(result).toBeInstanceOf(CreateSnippetDto);
      expect(result.text).toBe('Valid text for testing');
    });

    it('should throw BadRequestException for empty text', async () => {
      const rawData = { text: '' };

      await expect(
        validationPipe.transform(rawData, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for whitespace-only text', async () => {
      const rawData = { text: '   ' };

      await expect(
        validationPipe.transform(rawData, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for text longer than 1000 characters', async () => {
      const rawData = { text: 'a'.repeat(1001) };

      await expect(
        validationPipe.transform(rawData, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-string text', async () => {
      const rawData = { text: 123 };

      await expect(
        validationPipe.transform(rawData, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for missing text', async () => {
      const rawData = {};

      await expect(
        validationPipe.transform(rawData, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for extra properties', async () => {
      const rawData = {
        text: 'Valid text',
        extraProperty: 'should be rejected',
      };

      await expect(
        validationPipe.transform(rawData, {
          type: 'body',
          metatype: CreateSnippetDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept exactly 1000 characters', async () => {
      const rawData = { text: 'a'.repeat(1000) };

      const result = await validationPipe.transform(rawData, {
        type: 'body',
        metatype: CreateSnippetDto,
      });

      expect(result).toBeInstanceOf(CreateSnippetDto);
      expect(result.text).toHaveLength(1000);
    });

    it('should accept text with leading/trailing whitespace but not only whitespace', async () => {
      const rawData = { text: '  Valid text with spaces  ' };

      const result = await validationPipe.transform(rawData, {
        type: 'body',
        metatype: CreateSnippetDto,
      });

      expect(result).toBeInstanceOf(CreateSnippetDto);
      expect(result.text).toBe('  Valid text with spaces  ');
    });
  });

  describe('Error message validation', () => {
    it('should include specific error message for maxLength', async () => {
      const rawData = { text: 'a'.repeat(1001) };

      try {
        await validationPipe.transform(rawData, {
          type: 'body',
          metatype: CreateSnippetDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toHaveProperty('message');
        const messages = Array.isArray(error.getResponse().message)
          ? error.getResponse().message
          : [error.getResponse().message];
        expect(messages.some((msg) => msg.includes('1000'))).toBe(true);
      }
    });

    it('should include specific error message for whitespace-only', async () => {
      const rawData = { text: '   ' };

      try {
        await validationPipe.transform(rawData, {
          type: 'body',
          metatype: CreateSnippetDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toHaveProperty('message');
        const messages = Array.isArray(error.getResponse().message)
          ? error.getResponse().message
          : [error.getResponse().message];
        expect(
          messages.some((msg) =>
            msg.includes('Text cannot be only whitespace'),
          ),
        ).toBe(true);
      }
    });
  });
});
