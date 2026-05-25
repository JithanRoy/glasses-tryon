import type { Glasses } from "@glasses-tryon/shared";

type ProductCardProps = {
  product: Glasses;
  isSelected: boolean;
  onSelect: (product: Glasses) => void;
};

export function ProductCard({
  product,
  isSelected,
  onSelect,
}: ProductCardProps) {
  const formatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: product.currency,
  });

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className={`group grid min-h-64 w-full grid-rows-[1fr_auto] overflow-hidden rounded-md border bg-white text-left transition ${
        isSelected
          ? "border-[#1c1a17] shadow-[0_0_0_2px_#1c1a17]"
          : "border-[#ded4c3] hover:border-[#8a6f3f]"
      }`}
    >
      <div className="grid min-h-40 place-items-center bg-[#f4efe6] p-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-32 max-w-full object-contain transition group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f3f]">
            {product.brand}
          </p>
          <h3 className="mt-1 text-base font-semibold text-[#1c1a17]">
            {product.name}
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#4e3f25]">
          {formatter.format(product.price)}
        </p>
      </div>
    </button>
  );
}
