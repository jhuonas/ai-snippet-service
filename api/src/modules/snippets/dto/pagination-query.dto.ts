import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'take must be a number' })
  @Min(1, { message: 'take must be at least 1' })
  @Max(50, { message: 'take must not exceed 50' })
  take?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'skip must be a number' })
  @Min(0, { message: 'skip must be at least 0' })
  skip?: number;
}
