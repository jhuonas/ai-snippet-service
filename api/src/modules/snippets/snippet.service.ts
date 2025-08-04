import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import type { Snippet } from '@prisma/client';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SnippetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) {}

  async create(data: { text: string }): Promise<Snippet> {
    const summary = await this.aiService.summarize(data.text);

    const snippet = await this.prisma.snippet.create({
      data: {
        text: data.text,
        summary,
      },
    });

    return snippet;
  }

  async findAll(params: { take?: number; skip?: number } = {}): Promise<{
    data: Snippet[];
    total: number;
    take: number;
    skip: number;
  }> {
    const { take = 10, skip = 0 } = params;

    const [data, total] = await Promise.all([
      this.prisma.snippet.findMany({
        take,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.snippet.count(),
    ]);

    return {
      data,
      total,
      take,
      skip,
    };
  }
}
