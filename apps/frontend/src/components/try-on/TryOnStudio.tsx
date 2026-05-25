"use client";

import { useEffect, useMemo, useState } from "react";
import type { Glasses } from "@glasses-tryon/shared";
import { ImageUp, RotateCcw, SlidersHorizontal } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";

type TryOnStudioProps = {
  products: Glasses[];
};

type OverlaySettings = {
  x: number;
  y: number;
  width: number;
  rotation: number;
};

const defaultOverlay: OverlaySettings = {
  x: 50,
  y: 42,
  width: 48,
  rotation: 0,
};

export function TryOnStudio({ products }: TryOnStudioProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [overlay, setOverlay] = useState(defaultOverlay);
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? products[0];

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const overlayImage = useMemo(
    () => selectedProduct?.modelUrl ?? selectedProduct?.imageUrl,
    [selectedProduct],
  );

  function handleUpload(file?: File) {
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function updateOverlay(key: keyof OverlaySettings, value: number) {
    setOverlay((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
      <section className="min-w-0 rounded-md border border-[#ded4c3] bg-[#fbf8f2] p-4">
        <div className="relative grid aspect-[4/5] min-h-[420px] overflow-hidden rounded-md bg-[#24211d]">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Uploaded face preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <label className="grid cursor-pointer place-items-center p-8 text-center text-[#f7f3ec]">
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => handleUpload(event.target.files?.[0])}
              />
              <span className="grid max-w-sm justify-items-center gap-4">
                <span className="grid size-14 place-items-center rounded-md bg-[#f7f3ec] text-[#1c1a17]">
                  <ImageUp size={26} aria-hidden="true" />
                </span>
                <span className="text-xl font-semibold">Upload a face photo</span>
                <span className="text-sm leading-6 text-[#d6cbb9]">
                  JPG, PNG, or WebP works best. The frame overlay can be adjusted
                  manually in this MVP version.
                </span>
              </span>
            </label>
          )}

          {previewUrl && overlayImage ? (
            <img
              src={overlayImage}
              alt={selectedProduct?.name ?? "Selected glasses"}
              className="pointer-events-none absolute h-auto object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.28)]"
              style={{
                left: `${overlay.x}%`,
                top: `${overlay.y}%`,
                width: `${overlay.width}%`,
                transform: `translate(-50%, -50%) rotate(${overlay.rotation}deg)`,
              }}
            />
          ) : null}
        </div>
      </section>

      <aside className="min-w-0 space-y-6">
        <section className="rounded-md border border-[#ded4c3] bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f3f]">
                Selected Frame
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[#1c1a17]">
                {selectedProduct?.name ?? "No frame selected"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOverlay(defaultOverlay)}
              className="grid size-10 place-items-center rounded-md border border-[#ded4c3] text-[#1c1a17] transition hover:border-[#1c1a17]"
              aria-label="Reset overlay"
              title="Reset overlay"
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-4">
            <Control
              label="Horizontal"
              value={overlay.x}
              min={10}
              max={90}
              onChange={(value) => updateOverlay("x", value)}
            />
            <Control
              label="Vertical"
              value={overlay.y}
              min={10}
              max={90}
              onChange={(value) => updateOverlay("y", value)}
            />
            <Control
              label="Width"
              value={overlay.width}
              min={20}
              max={90}
              onChange={(value) => updateOverlay("width", value)}
            />
            <Control
              label="Rotate"
              value={overlay.rotation}
              min={-25}
              max={25}
              onChange={(value) => updateOverlay("rotation", value)}
            />
          </div>
        </section>

        <section className="rounded-md border border-[#ded4c3] bg-white p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-[#f4efe6] text-[#4e3f25]">
              <SlidersHorizontal size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6f3f]">
                Frames
              </p>
              <h2 className="text-xl font-semibold text-[#1c1a17]">
                Choose glasses
              </h2>
            </div>
          </div>
          <ProductGrid
            products={products}
            selectedProduct={selectedProduct}
            onSelect={(product) => setSelectedProductId(product.id)}
          />
        </section>
      </aside>
    </div>
  );
}

type ControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function Control({ label, value, min, max, onChange }: ControlProps) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between text-sm text-[#5f574d]">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full accent-[#4e3f25]"
      />
    </label>
  );
}
