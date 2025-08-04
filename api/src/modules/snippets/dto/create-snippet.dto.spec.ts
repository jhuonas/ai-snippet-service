import { validate } from 'class-validator';
import { CreateSnippetDto } from './create-snippet.dto';

describe('CreateSnippetDto', () => {
  describe('validation', () => {
    it('should pass validation with valid text', async () => {
      const dto = new CreateSnippetDto();
      dto.text = 'This is a valid text';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty text', async () => {
      const dto = new CreateSnippetDto();
      dto.text = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation with whitespace-only text', async () => {
      const dto = new CreateSnippetDto();
      dto.text = '   ';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.matches).toBeDefined();
      expect(errors[0].constraints?.matches).toContain(
        'Text cannot be only whitespace',
      );
    });

    it('should fail validation with text longer than 1000 characters', async () => {
      const dto = new CreateSnippetDto();
      dto.text = 'a'.repeat(1001);

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.maxLength).toBeDefined();
      expect(errors[0].constraints?.maxLength).toContain('1000');
    });

    it('should pass validation with exactly 1000 characters', async () => {
      const dto = new CreateSnippetDto();
      dto.text = 'a'.repeat(1000);

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with non-string text', async () => {
      const dto = new CreateSnippetDto();
      (dto as any).text = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should fail validation with null text', async () => {
      const dto = new CreateSnippetDto();
      (dto as any).text = null;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation with undefined text', async () => {
      const dto = new CreateSnippetDto();
      (dto as any).text = undefined;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });
  });
});
