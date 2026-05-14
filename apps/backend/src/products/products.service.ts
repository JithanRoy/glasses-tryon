import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Glasses } from '@glasses-tryon/shared';

@Injectable()
export class ProductsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAllByShop(shopId: string): Promise<Glasses[]> {
    const result = await this.supabaseService
      .getClient()
      .from('glasses')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_active', true);

    if (result.error) throw result.error;
    return result.data as Glasses[];
  }

  async findOne(id: string): Promise<Glasses> {
    const result = await this.supabaseService
      .getClient()
      .from('glasses')
      .select('*')
      .eq('id', id)
      .single();

    if (result.error) throw result.error;
    return result.data as Glasses;
  }

  async create(productData: Partial<Glasses>): Promise<Glasses> {
    const result = await this.supabaseService
      .getClient()
      .from('glasses')
      .insert([productData])
      .select()
      .single();

    if (result.error) throw result.error;
    return result.data as Glasses;
  }
}
