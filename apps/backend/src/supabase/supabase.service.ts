import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { WebSocketLikeConstructor } from '@supabase/realtime-js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are not provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      realtime: {
        transport: WebSocket as unknown as WebSocketLikeConstructor,
      },
    });
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
