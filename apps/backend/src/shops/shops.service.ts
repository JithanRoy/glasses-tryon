import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Shop } from '@glasses-tryon/shared';

@Injectable()
export class ShopsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(): Promise<Shop[]> {
    const result = await this.supabaseService
      .getClient()
      .from('shops')
      .select('*');

    if (result.error) throw result.error;
    return result.data as Shop[];
  }

  async findOneBySlug(slug: string): Promise<Shop> {
    const result = await this.supabaseService
      .getClient()
      .from('shops')
      .select('*')
      .eq('slug', slug)
      .single();

    if (result.error || !result.data) {
      throw new NotFoundException(`Shop with slug "${slug}" not found`);
    }

    return result.data as Shop;
  }

  async create(shopData: Partial<Shop>): Promise<Shop> {
    const result = await this.supabaseService
      .getClient()
      .from('shops')
      .insert([shopData])
      .select()
      .single();

    if (result.error) throw result.error;
    return result.data as Shop;
  }
}
