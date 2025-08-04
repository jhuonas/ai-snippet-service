import { Controller, Post, Body } from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import type { Snippet } from '@prisma/client';

@Controller('snippets')
export class SnippetController {
  constructor(private readonly snippetService: SnippetService) {}

  @Post()
  async create(@Body() createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    return this.snippetService.create(createSnippetDto);
  }
}
