import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SnippetService } from './snippets/snippet.service';
import { SnippetController } from './snippets/snippet.controller';
import { PrismaService } from './database/prisma/prisma.service';
import { AiService } from './ai/ai.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
  controllers: [SnippetController],
  providers: [SnippetService, PrismaService, AiService],
  exports: [PrismaService],
})
export class AppModule {}
