import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import type { Snippet } from '@prisma/client';

@Controller('snippets')
export class SnippetController {
  constructor(private readonly snippetService: SnippetService) {}

  @Post()
  async create(@Body() createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    return this.snippetService.create(createSnippetDto);
  }

  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<{
    data: Snippet[];
    total: number;
    take: number;
    skip: number;
  }> {
    return this.snippetService.findAll(paginationQuery);
  }
}
