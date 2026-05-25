import Link from "next/link";

export default function ShopNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f3ec] px-6 text-[#1c1a17]">
      <section className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a6f3f]">
          Shop unavailable
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Catalog not found</h1>
        <p className="mt-4 leading-7 text-[#5f574d]">
          The shop page could not be loaded. Check that the backend is running
          and that the shop slug exists in Supabase.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-[#1c1a17] px-4 text-sm font-semibold text-white"
        >
          Back Home
        </Link>
      </section>
    </main>
  );
}
