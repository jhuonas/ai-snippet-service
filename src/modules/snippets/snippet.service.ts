import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import type { Snippet } from '@prisma/client';

@Injectable()
export class SnippetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { text: string }): Promise<Snippet> {
    const summary = 'Hardcoded summary';

    return this.prisma.snippet.create({
      data: {
        text: data.text,
        summary,
      },
    });
  }
}
