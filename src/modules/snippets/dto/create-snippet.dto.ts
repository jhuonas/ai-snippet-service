import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
