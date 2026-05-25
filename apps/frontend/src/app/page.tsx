import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getProductsByShopId, getShops } from "@/lib/api";

export default async function Home() {
  const { error, products, shops } = await getInitialDashboardData();

  return (
    <AdminDashboard
      initialShops={shops}
      initialProducts={products}
      initialError={error}
    />
  );
}

async function getInitialDashboardData() {
  try {
    const shops = await getShops();
    const products = shops[0]
      ? await getProductsByShopId(shops[0].id, true)
      : [];

    return { shops, products };
  } catch (error) {
    return {
      shops: [],
      products: [],
      error:
        error instanceof Error ? error.message : "Could not connect to backend",
    };
  }
}
