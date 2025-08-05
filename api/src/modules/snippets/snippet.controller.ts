import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import type { Snippet } from '@prisma/client';

@ApiTags('Snippets')
@Controller('snippets')
export class SnippetController {
  constructor(private readonly snippetService: SnippetService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new snippet' })
  @ApiResponse({ status: 201, description: 'Snippet successfully created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async create(@Body() createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    return this.snippetService.create(createSnippetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a paginated list of snippets' })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of items to skip',
  })
  @ApiResponse({
    status: 200,
    description: 'List of snippets returned successfully',
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<{
    data: Snippet[];
    total: number;
    take: number;
    skip: number;
  }> {
    return this.snippetService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a snippet by ID' })
  @ApiParam({ name: 'id', description: 'Snippet ID', type: String })
  @ApiResponse({ status: 200, description: 'Snippet found' })
  @ApiResponse({ status: 404, description: 'Snippet not found' })
  async findById(@Param('id') id: string): Promise<Snippet> {
    return this.snippetService.findById(id);
  }
}
