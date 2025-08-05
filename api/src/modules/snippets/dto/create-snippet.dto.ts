import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSnippetDto {
  @ApiProperty({
    description: 'Original text to be summarized by the AI',
    example:
      'This is a sample paragraph that needs to be summarized by the AI system.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Text cannot be only whitespace' })
  @MaxLength(1000, { message: 'Text must not exceed 1000 characters' })
  text: string;
}
