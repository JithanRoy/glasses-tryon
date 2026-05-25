import type { Shop } from "@glasses-tryon/shared";

type ShopHeaderProps = {
  shop: Shop;
  productCount: number;
};

export function ShopHeader({ shop, productCount }: ShopHeaderProps) {
  return (
    <header className="border-b border-[#ded4c3] bg-[#fbf8f2]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="grid size-14 place-items-center rounded-md text-lg font-bold text-white"
            style={{ backgroundColor: shop.config?.primaryColor ?? "#1c1a17" }}
          >
            {shop.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a6f3f]">
              Shop Catalog
            </p>
            <h1 className="text-3xl font-semibold tracking-normal text-[#1c1a17]">
              {shop.name}
            </h1>
          </div>
        </div>
        <div className="flex gap-3 text-sm text-[#5f574d]">
          <span className="rounded-md border border-[#ded4c3] px-3 py-2">
            {productCount} active frames
          </span>
          <span className="rounded-md border border-[#ded4c3] px-3 py-2">
            /shop/{shop.slug}
          </span>
        </div>
      </div>
    </header>
  );
}
