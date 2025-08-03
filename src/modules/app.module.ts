import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SnippetService } from './snippets/snippet.service';
import { PrismaService } from './database/prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [SnippetService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
