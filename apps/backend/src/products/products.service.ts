import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Glasses } from '@glasses-tryon/shared';

type GlassesRow = {
  id: string;
  shop_id: string;
  name: string;
  brand: string;
  image_url: string;
  model_url: string | null;
  price: number;
  currency: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
};

const toGlasses = (row: GlassesRow): Glasses => ({
  id: row.id,
  shopId: row.shop_id,
  name: row.name,
  brand: row.brand,
  imageUrl: row.image_url,
  modelUrl: row.model_url ?? undefined,
  price: Number(row.price),
  currency: row.currency,
  description: row.description ?? undefined,
  isActive: row.is_active,
  createdAt: row.created_at,
});

const toGlassesRow = (g: Partial<Glasses>): Partial<GlassesRow> => ({
  ...(g.shopId !== undefined && { shop_id: g.shopId }),
  ...(g.name !== undefined && { name: g.name }),
  ...(g.brand !== undefined && { brand: g.brand }),
  ...(g.imageUrl !== undefined && { image_url: g.imageUrl }),
  ...(g.modelUrl !== undefined && { model_url: g.modelUrl }),
  ...(g.price !== undefined && { price: g.price }),
  ...(g.currency !== undefined && { currency: g.currency }),
  ...(g.description !== undefined && { description: g.description }),
  ...(g.isActive !== undefined && { is_active: g.isActive }),
});

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
    return (result.data as GlassesRow[]).map(toGlasses);
  }

  async findOne(id: string): Promise<Glasses> {
    const result = await this.supabaseService
      .getClient()
      .from('glasses')
      .select('*')
      .eq('id', id)
      .single();

    if (result.error) throw result.error;
    return toGlasses(result.data as GlassesRow);
  }

  async create(productData: Partial<Glasses>): Promise<Glasses> {
    const result = await this.supabaseService
      .getClient()
      .from('glasses')
      .insert([toGlassesRow(productData)])
      .select()
      .single();

    if (result.error) throw result.error;
    return toGlasses(result.data as GlassesRow);
  }
}
