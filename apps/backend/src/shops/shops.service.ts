import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Shop } from '@glasses-tryon/shared';

type ShopRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  config: Shop['config'];
  created_at: string;
};

const toShop = (row: ShopRow): Shop => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  logoUrl: row.logo_url ?? undefined,
  config: row.config,
  createdAt: row.created_at,
});

const toShopRow = (shop: Partial<Shop>): Partial<ShopRow> => ({
  ...(shop.name !== undefined && { name: shop.name }),
  ...(shop.slug !== undefined && { slug: shop.slug }),
  ...(shop.logoUrl !== undefined && { logo_url: shop.logoUrl }),
  ...(shop.config !== undefined && { config: shop.config }),
});

@Injectable()
export class ShopsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(): Promise<Shop[]> {
    const result = await this.supabaseService
      .getClient()
      .from('shops')
      .select('*');

    if (result.error) throw result.error;
    return (result.data as ShopRow[]).map(toShop);
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

    return toShop(result.data as ShopRow);
  }

  async create(shopData: Partial<Shop>): Promise<Shop> {
    const result = await this.supabaseService
      .getClient()
      .from('shops')
      .insert([toShopRow(shopData)])
      .select()
      .single();

    if (result.error) throw result.error;
    return toShop(result.data as ShopRow);
  }
}
