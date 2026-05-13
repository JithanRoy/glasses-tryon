import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Glasses } from '@glasses-tryon/shared';

@Injectable()
export class ProductsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAllByShop(shopId: string): Promise<Glasses[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('glasses')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<Glasses> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('glasses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(productData: Partial<Glasses>): Promise<Glasses> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('glasses')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
