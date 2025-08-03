import { Injectable } from '@nestjs/common';

export interface CreateSnippetDto {
  text: string;
}

export interface Snippet {
  id: string;
  text: string;
  summary: string;
  createdAt: Date;
}

@Injectable()
export class SnippetService {
  async create(dto: CreateSnippetDto): Promise<Snippet> {
    return {
      id: '1',
      text: dto.text,
      summary: 'This is an example summary.',
      createdAt: new Date(),
    };
  }
}
