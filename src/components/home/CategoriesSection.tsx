import Image from "next/image"

export default function CategoriesSection() {

  const categories = [
    { name: "Tea", image: "/categories/tea.jpeg" },
    { name: "Snacks", image: "/categories/snacks.jpeg" },
    { name: "Decor", image: "/categories/decor.jpeg" },
    { name: "Kitchen", image: "/categories/kitchen.jpeg" },
    { name: "Herbs", image: "/categories/herbs.jpeg" },
    { name: "Noodles", image: "/categories/noodles.jpeg" }
  ]

  return (
    <section className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">

      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        Browse Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {categories.map((cat)=>(
          <div
            key={cat.name}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
          >

            <Image
              src={cat.image}
              alt={cat.name}
              width={400}
              height={300}
              className="object-cover w-full h-40 sm:h-44 md:h-48 lg:h-52 group-hover:scale-110 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <h3 className="absolute bottom-3 left-3 text-white text-lg md:text-xl font-semibold">
              {cat.name}
            </h3>

          </div>
        ))}

      </div>

    </section>
  )
}