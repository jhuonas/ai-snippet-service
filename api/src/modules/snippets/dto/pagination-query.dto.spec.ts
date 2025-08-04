import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { PaginationQueryDto } from './pagination-query.dto';

describe('PaginationQueryDto', () => {
  let validationPipe: ValidationPipe;

  beforeEach(() => {
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  describe('validation', () => {
    it('should pass validation with no parameters (default values)', async () => {
      const dto = new PaginationQueryDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid take and skip values', async () => {
      const dto = new PaginationQueryDto();
      dto.take = 10;
      dto.skip = 0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with take=5 and skip=2', async () => {
      const dto = new PaginationQueryDto();
      dto.take = 5;
      dto.skip = 2;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with take=50 (maximum allowed)', async () => {
      const dto = new PaginationQueryDto();
      dto.take = 50;
      dto.skip = 0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with skip=0', async () => {
      const dto = new PaginationQueryDto();
      dto.take = 10;
      dto.skip = 0;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with large skip value', async () => {
      const dto = new PaginationQueryDto();
      dto.take = 10;
      dto.skip = 1000;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('ValidationPipe integration', () => {
    it('should transform valid query parameters', async () => {
      const rawData = { take: '10', skip: '0' };

      const result = (await validationPipe.transform(rawData, {
        type: 'query',
        metatype: PaginationQueryDto,
      })) as PaginationQueryDto;

      expect(result).toBeInstanceOf(PaginationQueryDto);
      expect(result.take).toBe(10);
      expect(result.skip).toBe(0);
    });

    it('should transform string numbers to actual numbers', async () => {
      const rawData = { take: '5', skip: '2' };

      const result = (await validationPipe.transform(rawData, {
        type: 'query',
        metatype: PaginationQueryDto,
      })) as PaginationQueryDto;

      expect(result).toBeInstanceOf(PaginationQueryDto);
      expect(result.take).toBe(5);
      expect(result.skip).toBe(2);
    });

    it('should use default values when parameters are not provided', async () => {
      const rawData = {};

      const result = (await validationPipe.transform(rawData, {
        type: 'query',
        metatype: PaginationQueryDto,
      })) as PaginationQueryDto;

      expect(result).toBeInstanceOf(PaginationQueryDto);
      expect(result.take).toBeUndefined();
      expect(result.skip).toBeUndefined();
    });

    it('should throw BadRequestException for take greater than 50', async () => {
      const rawData = { take: '51', skip: '0' };

      await expect(
        validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for negative skip', async () => {
      const rawData = { take: '10', skip: '-1' };

      await expect(
        validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for negative take', async () => {
      const rawData = { take: '-5', skip: '0' };

      await expect(
        validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-numeric take', async () => {
      const rawData = { take: 'abc', skip: '0' };

      await expect(
        validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for non-numeric skip', async () => {
      const rawData = { take: '10', skip: 'xyz' };

      await expect(
        validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for take=0', async () => {
      const rawData = { take: '0', skip: '0' };

      await expect(
        validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for extra properties', async () => {
      const rawData = {
        take: '10',
        skip: '0',
        extraProperty: 'should be rejected',
      };

      await expect(
        validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle edge case with take=1', async () => {
      const rawData = { take: '1', skip: '0' };

      const result = (await validationPipe.transform(rawData, {
        type: 'query',
        metatype: PaginationQueryDto,
      })) as PaginationQueryDto;

      expect(result).toBeInstanceOf(PaginationQueryDto);
      expect(result.take).toBe(1);
      expect(result.skip).toBe(0);
    });

    it('should handle edge case with take=50 and skip=0', async () => {
      const rawData = { take: '50', skip: '0' };

      const result = (await validationPipe.transform(rawData, {
        type: 'query',
        metatype: PaginationQueryDto,
      })) as PaginationQueryDto;

      expect(result).toBeInstanceOf(PaginationQueryDto);
      expect(result.take).toBe(50);
      expect(result.skip).toBe(0);
    });
  });

  describe('Error message validation', () => {
    it('should include specific error message for take > 50', async () => {
      const rawData = { take: '51', skip: '0' };

      try {
        await validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toHaveProperty('message');
        const messages = Array.isArray(error.getResponse().message)
          ? error.getResponse().message
          : [error.getResponse().message];
        expect(messages.some((msg) => msg.includes('50'))).toBe(true);
      }
    });

    it('should include specific error message for negative skip', async () => {
      const rawData = { take: '10', skip: '-1' };

      try {
        await validationPipe.transform(rawData, {
          type: 'query',
          metatype: PaginationQueryDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse()).toHaveProperty('message');
        const messages = Array.isArray(error.getResponse().message)
          ? error.getResponse().message
          : [error.getResponse().message];
        expect(messages.some((msg) => msg.includes('0'))).toBe(true);
      }
    });
  });
});
