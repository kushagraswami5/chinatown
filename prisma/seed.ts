import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

async function main() {

  /* ---------------- USER (Vendor) ---------------- */

  const user = await prisma.user.upsert({
  where: { email: "vendor@chinatown.com" },
  update: {},
  create: {
    name: "Demo Vendor",
    email: "vendor@chinatown.com",
    password: "password123",
    role: "VENDOR"
  }
})

  const vendor = await prisma.vendorProfile.upsert({
  where: { userId: user.id },
  update: {},
  create: {
    businessName: "ChinaTown Official",
    warehouseAddress: "London Warehouse",
    approved: true,
    userId: user.id
  }
})

  /* ---------------- CATEGORIES ---------------- */

  const categoryNames = [
    "Tea & Teaware",
    "Home Decor",
    "Chinese Fashion",
    "Ceramics",
    "Calligraphy",
    "Traditional Art"
  ]

  const categories = []

for (const name of categoryNames) {

  const category = await prisma.category.upsert({
    where: { name },
    update: {},
    create: { name }
  })

  categories.push(category)
}

  /* ---------------- PRODUCTS ---------------- */

  for (let i = 0; i < 40; i++) {

    const category = faker.helpers.arrayElement(categories)

    const product = await prisma.product.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price({ min: 10, max: 120 })),
        discountPrice: Number(faker.commerce.price({ min: 5, max: 90 })),
        totalStock: faker.number.int({ min: 10, max: 200 }),
        vendorId: vendor.id,
        categoryId: category.id
      }
    })

    /* -------- PRODUCT IMAGE -------- */

    await prisma.productImage.createMany({
  data: [{
    url: `https://picsum.photos/seed/${product.id}/600/600`,
    productId: product.id
  }]
})

    /* -------- VARIANT -------- */

    await prisma.productVariant.create({
      data: {
        sku: faker.string.alphanumeric(10),
        stock: faker.number.int({ min: 5, max: 50 }),
        productId: product.id
      }
    })

  }

  console.log("✅ 40 Sample products generated")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())