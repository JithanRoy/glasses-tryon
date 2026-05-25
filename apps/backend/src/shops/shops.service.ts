import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Glasses, Shop } from '@glasses-tryon/shared';

type ShopRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  config: Shop['config'];
  created_at: string;
};

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

export type ShopCatalog = {
  shop: Shop;
  products: Glasses[];
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

  async findCatalogBySlug(slug: string): Promise<ShopCatalog> {
    const shop = await this.findOneBySlug(slug);
    const result = await this.supabaseService
      .getClient()
      .from('glasses')
      .select('*')
      .eq('shop_id', shop.id)
      .eq('is_active', true);

    if (result.error) throw result.error;

    return {
      shop,
      products: (result.data as GlassesRow[]).map(toGlasses),
    };
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

  async update(id: string, shopData: Partial<Shop>): Promise<Shop> {
    const result = await this.supabaseService
      .getClient()
      .from('shops')
      .update(toShopRow(shopData))
      .eq('id', id)
      .select()
      .single();

    if (result.error || !result.data) {
      throw new NotFoundException(`Shop with id "${id}" not found`);
    }

    return toShop(result.data as ShopRow);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const result = await this.supabaseService
      .getClient()
      .from('shops')
      .delete()
      .eq('id', id);

    if (result.error) throw result.error;

    return { deleted: true };
  }
}
