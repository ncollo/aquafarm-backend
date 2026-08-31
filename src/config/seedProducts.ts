import prisma from './prisma';
import { ProductStatus } from '@prisma/client';

export const seedDefaultProducts = async (): Promise<void> => {
  try {
    const count = await prisma.product.count();
    if (count > 0) {
      return; // Products already exist in database
    }

    const defaultProducts = [
      {
        name: "Fresh Nile Tilapia (Whole)",
        category: "fish",
        price: 350,
        unit: "per kg",
        stock: 500,
        description: "Farm-fresh whole tilapia, cleaned and ready. Average fish weight 400–600g.",
        imageUrl: "https://images.unsplash.com/photo-1649347173558-a305d7b8ff98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwYXF1YWN1bHR1cmV8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Fresh African Catfish",
        category: "fish",
        price: 400,
        unit: "per kg",
        stock: 350,
        description: "Whole catfish, farm-fresh. Available in sizes 500g–2kg per fish.",
        imageUrl: "https://images.unsplash.com/photo-1607629194620-a9726803827c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMGhhcnZlc3QlMjBmcmVzaCUyMGZpc2glMjB3b3JrZXJzfGVufDF8fHx8MTc3NDU0NDM4MXww&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Premium Rainbow Trout",
        category: "fish",
        price: 650,
        unit: "per kg",
        stock: 120,
        description: "Cold-water premium trout, rich in Omega-3. Restaurant and hotel grade.",
        imageUrl: "https://images.unsplash.com/photo-1770529882297-d60092c0c834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaHdhdGVyJTIwZmlzaCUyMGNhcnAlMjBwb25kJTIwc3VyZmFjZXxlbnwxfHx8fDE3NzQ1NDQzODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Tilapia Fingerlings (100 pcs)",
        category: "fingerlings",
        price: 1500,
        unit: "per 100",
        stock: 50,
        description: "Certified Grade-A Nile Tilapia fingerlings, 3–5cm. Disease-free, vaccinated.",
        imageUrl: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Catfish Fingerlings (50 pcs)",
        category: "fingerlings",
        price: 1200,
        unit: "per 50",
        stock: 40,
        description: "African Catfish fingerlings, 4–6cm. Ready for pond stocking.",
        imageUrl: "https://images.unsplash.com/photo-1758854486625-2ef3d73853fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcG9uaWNzJTIwd2F0ZXIlMjB0ZWNobm9sb2d5JTIwZmlzaCUyMHRhbmt8ZW58MXx8fHwxNzc0NTQ0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Beginner Fishing Rod Set",
        category: "rods",
        price: 2500,
        unit: "per set",
        stock: 25,
        description: "Complete starter kit — 1.8m fiberglass rod, spinning reel, line, and basic tackle box.",
        imageUrl: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Pro Angler Carbon Fiber Rod",
        category: "rods",
        price: 8500,
        unit: "per piece",
        stock: 10,
        description: "2.4m ultra-light carbon fiber rod. Professional grade for competitive sport fishing.",
        imageUrl: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Assorted Hooks Pack (50 pcs)",
        category: "tackle",
        price: 350,
        unit: "per pack",
        stock: 80,
        description: "Mixed sizes 4–12 barbless hooks. Suitable for tilapia and catfish.",
        imageUrl: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Artificial Lure Collection (10 pcs)",
        category: "tackle",
        price: 1200,
        unit: "per set",
        stock: 30,
        description: "10 colorful artificial lures for bass and catfish. Floating and sinking types included.",
        imageUrl: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Premium Floating Pellets (5kg)",
        category: "feed",
        price: 950,
        unit: "per bag",
        stock: 150,
        description: "High-protein (38%) floating fish pellets for Tilapia and Catfish grow-out stage.",
        imageUrl: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Fingerling Starter Crumbles (1kg)",
        category: "feed",
        price: 450,
        unit: "per bag",
        stock: 100,
        description: "Ultra-fine 45% protein starter feed crumbles for fingerlings up to 10g.",
        imageUrl: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
      {
        name: "Fishing Hat & UV Gloves Set",
        category: "accessories",
        price: 800,
        unit: "per set",
        stock: 45,
        description: "Wide-brim waterproof fishing hat and UV-protection fingerless gloves. Perfect for outdoor fishing.",
        imageUrl: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        status: ProductStatus.AVAILABLE,
      },
    ];

    for (const p of defaultProducts) {
      await prisma.product.create({ data: p });
    }

    console.log(`[Seed] Seeded ${defaultProducts.length} default store products into database.`);
  } catch (error) {
    console.error('[Seed] Error seeding default products:', error);
  }
};
