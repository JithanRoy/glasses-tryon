import type { Glasses, Shop } from "@glasses-tryon/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type FetchOptions = {
  body?: unknown;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  next?: NextFetchRequestConfig;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    method: options.method ?? "GET",
    next: options.next,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function getShops(): Promise<Shop[]> {
  return request<Shop[]>("/shops");
}

export async function getShopBySlug(slug: string): Promise<Shop> {
  return request<Shop>(`/shops/${slug}`);
}

export async function createShop(shop: Partial<Shop>): Promise<Shop> {
  return request<Shop>("/shops", {
    method: "POST",
    body: shop,
  });
}

export async function updateShop(
  id: string,
  shop: Partial<Shop>,
): Promise<Shop> {
  return request<Shop>(`/shops/${id}`, {
    method: "PATCH",
    body: shop,
  });
}

export async function deleteShop(id: string): Promise<{ deleted: true }> {
  return request<{ deleted: true }>(`/shops/${id}`, {
    method: "DELETE",
  });
}

export async function getProductsByShopId(
  shopId: string,
  includeInactive = false,
): Promise<Glasses[]> {
  const params = new URLSearchParams({ shopId });

  if (includeInactive) {
    params.set("includeInactive", "true");
  }

  return request<Glasses[]>(`/products?${params.toString()}`);
}

export async function createProduct(product: Partial<Glasses>): Promise<Glasses> {
  return request<Glasses>("/products", {
    method: "POST",
    body: product,
  });
}

export async function updateProduct(
  id: string,
  product: Partial<Glasses>,
): Promise<Glasses> {
  return request<Glasses>(`/products/${id}`, {
    method: "PATCH",
    body: product,
  });
}

export async function deleteProduct(id: string): Promise<{ deleted: true }> {
  return request<{ deleted: true }>(`/products/${id}`, {
    method: "DELETE",
  });
}

export async function getShopCatalog(slug: string) {
  return request<{ shop: Shop; products: Glasses[] }>(`/shops/${slug}/catalog`);
}
