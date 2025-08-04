import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\s*$).+/, { message: 'Text cannot be only whitespace' })
  @MaxLength(1000, { message: 'Text must not exceed 1000 characters' })
  text: string;
}
