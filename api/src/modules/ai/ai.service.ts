import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly version: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('ANTHROPIC_API_KEY')!;
    this.model =
      this.config.get<string>('ANTHROPIC_MODEL') ?? 'claude-3-haiku-20240307';
    this.version =
      this.config.get<string>('ANTHROPIC_API_VERSION') ?? '2023-06-01';
  }

  async summarize(text: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: this.model,
          max_tokens: 100,
          messages: [
            {
              role: 'user',
              content: `Summarize the following content in no more than 30 words. Be clear and focused:\n${text}`,
            },
          ],
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': this.version,
            'content-type': 'application/json',
          },
        },
      );

      return response.data?.content?.[0]?.text || 'Failed to summarize';
    } catch (error) {
      throw new InternalServerErrorException('AI summary failed');
    }
  }
}
