import ProductCard from "@/components/product-card"

export default function FeaturedProducts({ products }: any) {

  return (
    <section className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">

      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        Featured Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">

        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} />
        ))}

      </div>

    </section>
  )
}