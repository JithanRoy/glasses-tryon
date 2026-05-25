import { notFound } from "next/navigation";
import { TryOnStudio } from "@/components/try-on/TryOnStudio";
import { ShopHeader } from "@/components/shop/ShopHeader";
import { getShopCatalog } from "@/lib/api";

type ShopPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;
  const catalog = await getCatalogOrNotFound(slug);

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#1c1a17]">
      <ShopHeader shop={catalog.shop} productCount={catalog.products.length} />
      <section className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
        <TryOnStudio products={catalog.products} />
      </section>
    </main>
  );
}

async function getCatalogOrNotFound(slug: string) {
  try {
    return await getShopCatalog(slug);
  } catch {
    notFound();
  }
}
