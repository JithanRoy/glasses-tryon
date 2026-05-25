"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Glasses, Shop } from "@glasses-tryon/shared";
import {
  Check,
  ExternalLink,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  createProduct,
  createShop,
  deleteProduct,
  deleteShop,
  getProductsByShopId,
  getShops,
  updateProduct,
  updateShop,
} from "@/lib/api";

type ShopForm = {
  id?: string;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
};

type ProductForm = {
  id?: string;
  name: string;
  brand: string;
  imageUrl: string;
  modelUrl: string;
  price: string;
  currency: string;
  description: string;
  isActive: boolean;
};

const emptyShopForm: ShopForm = {
  name: "",
  slug: "",
  logoUrl: "",
  primaryColor: "#111111",
};

const emptyProductForm: ProductForm = {
  name: "",
  brand: "",
  imageUrl: "",
  modelUrl: "",
  price: "",
  currency: "USD",
  description: "",
  isActive: true,
};

type AdminDashboardProps = {
  initialError?: string;
  initialProducts: Glasses[];
  initialShops: Shop[];
};

export function AdminDashboard({
  initialError,
  initialProducts,
  initialShops,
}: AdminDashboardProps) {
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [products, setProducts] = useState<Glasses[]>(initialProducts);
  const [selectedShopId, setSelectedShopId] = useState<string | undefined>(
    initialShops[0]?.id,
  );
  const [shopForm, setShopForm] = useState<ShopForm>(emptyShopForm);
  const [productForm, setProductForm] =
    useState<ProductForm>(emptyProductForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string | undefined>(initialError);

  const selectedShop = useMemo(
    () => shops.find((shop) => shop.id === selectedShopId),
    [selectedShopId, shops],
  );

  const visibleProducts = selectedShop ? products : [];

  async function loadShops() {
    setIsLoading(true);
    setError(undefined);

    try {
      const nextShops = await getShops();
      const nextSelectedShopId =
        selectedShopId && nextShops.some((shop) => shop.id === selectedShopId)
          ? selectedShopId
          : nextShops[0]?.id;

      setShops(nextShops);
      setSelectedShopId(nextSelectedShopId);

      if (nextSelectedShopId) {
        await loadProducts(nextSelectedShopId);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function loadProducts(shopId?: string) {
    if (!shopId) return;

    setIsProductsLoading(true);
    setError(undefined);

    try {
      setProducts(await getProductsByShopId(shopId, true));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsProductsLoading(false);
    }
  }

  function selectShop(shopId: string) {
    setSelectedShopId(shopId);
    void loadProducts(shopId);
  }

  async function handleShopSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setMessage(undefined);

    const payload: Partial<Shop> = {
      name: shopForm.name.trim(),
      slug: shopForm.slug.trim(),
      logoUrl: shopForm.logoUrl.trim() || undefined,
      config: {
        primaryColor: shopForm.primaryColor,
      },
    };

    try {
      const savedShop = shopForm.id
        ? await updateShop(shopForm.id, payload)
        : await createShop(payload);

      setMessage(shopForm.id ? "Shop updated" : "Shop created");
      setShopForm(emptyShopForm);
      await loadShops();
      setSelectedShopId(savedShop.id);
      await loadProducts(savedShop.id);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedShop) return;

    setError(undefined);
    setMessage(undefined);

    const payload: Partial<Glasses> = {
      shopId: selectedShop.id,
      name: productForm.name.trim(),
      brand: productForm.brand.trim(),
      imageUrl: productForm.imageUrl.trim(),
      modelUrl: productForm.modelUrl.trim() || undefined,
      price: Number(productForm.price),
      currency: productForm.currency.trim() || "USD",
      description: productForm.description.trim() || undefined,
      isActive: productForm.isActive,
    };

    try {
      if (productForm.id) {
        await updateProduct(productForm.id, payload);
      } else {
        await createProduct(payload);
      }

      setMessage(productForm.id ? "Product updated" : "Product created");
      setProductForm(emptyProductForm);
      await loadProducts(selectedShop.id);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteShop(shop: Shop) {
    if (!confirm(`Delete ${shop.name}? This also removes its products.`)) return;

    setError(undefined);
    setMessage(undefined);

    try {
      await deleteShop(shop.id);
      setMessage("Shop deleted");
      setSelectedShopId(undefined);
      await loadShops();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDeleteProduct(product: Glasses) {
    if (!confirm(`Delete ${product.name}?`)) return;

    setError(undefined);
    setMessage(undefined);

    try {
      await deleteProduct(product.id);
      setMessage("Product deleted");
      await loadProducts(product.shopId);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function editShop(shop: Shop) {
    setShopForm({
      id: shop.id,
      name: shop.name,
      slug: shop.slug,
      logoUrl: shop.logoUrl ?? "",
      primaryColor: shop.config?.primaryColor ?? "#111111",
    });
  }

  function editProduct(product: Glasses) {
    setProductForm({
      id: product.id,
      name: product.name,
      brand: product.brand,
      imageUrl: product.imageUrl,
      modelUrl: product.modelUrl ?? "",
      price: String(product.price),
      currency: product.currency,
      description: product.description ?? "",
      isActive: product.isActive,
    });
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#1f1d1a]">
      <section className="border-b border-[#ddd5c7] bg-[#fbfaf6]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7b6846]">
              Glasses Try-On Admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">
              Shop and product manager
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void loadShops()}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#cfc3b0] px-3 text-sm font-semibold transition hover:border-[#1f1d1a]"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 sm:px-8 xl:grid-cols-[380px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <Panel title={shopForm.id ? "Edit Shop" : "Create Shop"}>
            <form className="space-y-4" onSubmit={handleShopSubmit}>
              <TextField
                label="Shop Name"
                value={shopForm.name}
                onChange={(value) =>
                  setShopForm((current) => ({ ...current, name: value }))
                }
                placeholder="Vision Center"
                required
              />
              <TextField
                label="Slug"
                value={shopForm.slug}
                onChange={(value) =>
                  setShopForm((current) => ({
                    ...current,
                    slug: slugify(value),
                  }))
                }
                placeholder="vision-center"
                required
              />
              <TextField
                label="Logo URL"
                value={shopForm.logoUrl}
                onChange={(value) =>
                  setShopForm((current) => ({ ...current, logoUrl: value }))
                }
                placeholder="https://example.com/logo.png"
              />
              <label className="grid gap-2 text-sm font-medium">
                Primary Color
                <input
                  type="color"
                  value={shopForm.primaryColor}
                  onChange={(event) =>
                    setShopForm((current) => ({
                      ...current,
                      primaryColor: event.target.value,
                    }))
                  }
                  className="h-10 w-full rounded-md border border-[#cfc3b0] bg-white"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#1f1d1a] px-4 text-sm font-semibold text-white transition hover:bg-[#5d4b2f]"
                >
                  {shopForm.id ? (
                    <Check size={16} aria-hidden="true" />
                  ) : (
                    <Plus size={16} aria-hidden="true" />
                  )}
                  {shopForm.id ? "Save Shop" : "Create Shop"}
                </button>
                {shopForm.id ? (
                  <button
                    type="button"
                    onClick={() => setShopForm(emptyShopForm)}
                    className="h-10 rounded-md border border-[#cfc3b0] px-3 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </Panel>

          <Panel title="Shops">
            {isLoading ? (
              <p className="text-sm text-[#6f665b]">Loading shops...</p>
            ) : shops.length === 0 ? (
              <p className="text-sm leading-6 text-[#6f665b]">
                No shops yet. Create your first shop to start adding products.
              </p>
            ) : (
              <div className="space-y-2">
                {shops.map((shop) => (
                  <button
                    key={shop.id}
                    type="button"
                    onClick={() => selectShop(shop.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md border p-3 text-left transition ${
                      selectedShopId === shop.id
                        ? "border-[#1f1d1a] bg-[#f4efe6]"
                        : "border-[#ddd5c7] bg-white hover:border-[#8a7653]"
                    }`}
                  >
                    <span>
                      <span className="block font-semibold">{shop.name}</span>
                      <span className="text-xs text-[#6f665b]">
                        /shop/{shop.slug}
                      </span>
                    </span>
                    <span
                      className="size-5 rounded-full"
                      style={{
                        backgroundColor: shop.config?.primaryColor ?? "#111111",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </Panel>
        </aside>

        <section className="space-y-6">
          {message ? (
            <Status tone="success" text={message} />
          ) : error ? (
            <Status tone="error" text={error} />
          ) : null}

          {selectedShop ? (
            <>
              <Panel
                title={selectedShop.name}
                action={
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`/shop/${selectedShop.slug}`}
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-[#cfc3b0] px-3 text-sm font-semibold"
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                      Public Page
                    </a>
                    <IconButton
                      label="Edit shop"
                      onClick={() => editShop(selectedShop)}
                    >
                      <Pencil size={16} aria-hidden="true" />
                    </IconButton>
                    <IconButton
                      label="Delete shop"
                      onClick={() => void handleDeleteShop(selectedShop)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </IconButton>
                  </div>
                }
              >
                <div className="grid gap-3 text-sm text-[#6f665b] sm:grid-cols-3">
                  <Info label="Shop ID" value={selectedShop.id} />
                  <Info label="Slug" value={selectedShop.slug} />
                  <Info label="Products" value={String(visibleProducts.length)} />
                </div>
              </Panel>

              <Panel title={productForm.id ? "Edit Product" : "Create Product"}>
                <form
                  className="grid gap-4 md:grid-cols-2"
                  onSubmit={handleProductSubmit}
                >
                  <TextField
                    label="Product Name"
                    value={productForm.name}
                    onChange={(value) =>
                      setProductForm((current) => ({
                        ...current,
                        name: value,
                      }))
                    }
                    placeholder="Classic Black Frame"
                    required
                  />
                  <TextField
                    label="Brand"
                    value={productForm.brand}
                    onChange={(value) =>
                      setProductForm((current) => ({
                        ...current,
                        brand: value,
                      }))
                    }
                    placeholder="Acme Eyewear"
                    required
                  />
                  <TextField
                    label="Preview Image URL"
                    value={productForm.imageUrl}
                    onChange={(value) =>
                      setProductForm((current) => ({
                        ...current,
                        imageUrl: value,
                      }))
                    }
                    placeholder="https://example.com/frame.png"
                    required
                  />
                  <TextField
                    label="Overlay Model URL"
                    value={productForm.modelUrl}
                    onChange={(value) =>
                      setProductForm((current) => ({
                        ...current,
                        modelUrl: value,
                      }))
                    }
                    placeholder="https://example.com/overlay.png"
                  />
                  <TextField
                    label="Price"
                    value={productForm.price}
                    onChange={(value) =>
                      setProductForm((current) => ({
                        ...current,
                        price: value,
                      }))
                    }
                    placeholder="99.99"
                    required
                    type="number"
                  />
                  <TextField
                    label="Currency"
                    value={productForm.currency}
                    onChange={(value) =>
                      setProductForm((current) => ({
                        ...current,
                        currency: value.toUpperCase(),
                      }))
                    }
                    placeholder="USD"
                    required
                  />
                  <label className="grid gap-2 text-sm font-medium md:col-span-2">
                    Description
                    <textarea
                      value={productForm.description}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      rows={3}
                      className="rounded-md border border-[#cfc3b0] bg-white px-3 py-2 outline-none transition focus:border-[#1f1d1a]"
                      placeholder="Lightweight everyday frame"
                    />
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(event) =>
                        setProductForm((current) => ({
                          ...current,
                          isActive: event.target.checked,
                        }))
                      }
                      className="size-4 accent-[#1f1d1a]"
                    />
                    Active product
                  </label>
                  <div className="flex gap-2 md:justify-end">
                    {productForm.id ? (
                      <button
                        type="button"
                        onClick={() => setProductForm(emptyProductForm)}
                        className="h-10 rounded-md border border-[#cfc3b0] px-3 text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    ) : null}
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#1f1d1a] px-4 text-sm font-semibold text-white transition hover:bg-[#5d4b2f]"
                    >
                      {productForm.id ? (
                        <Check size={16} aria-hidden="true" />
                      ) : (
                        <Plus size={16} aria-hidden="true" />
                      )}
                      {productForm.id ? "Save Product" : "Create Product"}
                    </button>
                  </div>
                </form>
              </Panel>

              <Panel title="Products">
                {isProductsLoading ? (
                  <p className="text-sm text-[#6f665b]">Loading products...</p>
                ) : visibleProducts.length === 0 ? (
                  <p className="text-sm leading-6 text-[#6f665b]">
                    No products under this shop yet.
                  </p>
                ) : (
                  <div className="grid gap-3">
                    {visibleProducts.map((product) => (
                      <article
                        key={product.id}
                        className="grid gap-4 rounded-md border border-[#ddd5c7] bg-white p-3 sm:grid-cols-[120px_minmax(0,1fr)_auto]"
                      >
                        <div className="grid h-28 place-items-center rounded-md bg-[#f4efe6] p-2">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="max-h-24 max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <span
                              className={`rounded px-2 py-1 text-xs font-semibold ${
                                product.isActive
                                  ? "bg-[#e5f4df] text-[#315724]"
                                  : "bg-[#eee8dd] text-[#6f665b]"
                              }`}
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-[#6f665b]">
                            {product.brand} · {product.currency} {product.price}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6f665b]">
                            {product.description || "No description"}
                          </p>
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <IconButton
                            label="Edit product"
                            onClick={() => editProduct(product)}
                          >
                            <Pencil size={16} aria-hidden="true" />
                          </IconButton>
                          <IconButton
                            label="Delete product"
                            onClick={() => void handleDeleteProduct(product)}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </IconButton>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </Panel>
            </>
          ) : (
            <Panel title="Select a shop">
              <p className="text-sm leading-6 text-[#6f665b]">
                Create or select a shop to manage its glasses products.
              </p>
            </Panel>
          )}
        </section>
      </section>
    </main>
  );
}

type PanelProps = {
  action?: React.ReactNode;
  children: React.ReactNode;
  title: string;
};

function Panel({ action, children, title }: PanelProps) {
  return (
    <section className="rounded-md border border-[#ddd5c7] bg-[#fbfaf6] p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

type TextFieldProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
};

function TextField({
  label,
  onChange,
  placeholder,
  required,
  type = "text",
  value,
}: TextFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-md border border-[#cfc3b0] bg-white px-3 outline-none transition focus:border-[#1f1d1a]"
      />
    </label>
  );
}

type IconButtonProps = {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
};

function IconButton({ children, label, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-md border border-[#cfc3b0] text-[#1f1d1a] transition hover:border-[#1f1d1a] hover:bg-[#f4efe6]"
    >
      {children}
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-[#f4efe6] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b6846]">
        {label}
      </p>
      <p className="mt-1 truncate font-medium text-[#1f1d1a]">{value}</p>
    </div>
  );
}

function Status({ text, tone }: { text: string; tone: "error" | "success" }) {
  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm font-medium ${
        tone === "success"
          ? "border-[#b7d7a8] bg-[#edf8e8] text-[#315724]"
          : "border-[#e1b3a8] bg-[#fff1ee] text-[#8a2f20]"
      }`}
    >
      {text}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
