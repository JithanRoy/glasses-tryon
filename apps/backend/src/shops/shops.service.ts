import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Shop } from '@glasses-tryon/shared';

@Injectable()
export class ShopsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(): Promise<Shop[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('shops')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findOneBySlug(slug: string): Promise<Shop> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('shops')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Shop with slug "${slug}" not found`);
    }

    return data;
  }

  async create(shopData: Partial<Shop>): Promise<Shop> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('shops')
      .insert([shopData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
