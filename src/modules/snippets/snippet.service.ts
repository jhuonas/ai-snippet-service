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

    return this.prisma.snippet.create({
      data: {
        text: data.text,
        summary,
      },
    });
  }
}
