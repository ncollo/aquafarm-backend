import prisma from './prisma';
import { ProductStatus } from '@prisma/client';

export const defaultStoreCatalog = [
  // ─── Fresh Fish ─────────────────────────────────────────────────────────────
  {
    name: "Fresh Nile Tilapia (Whole Cleaned)",
    category: "fish",
    price: 380,
    unit: "per kg",
    stock: 850,
    description: "Farm-fresh whole Nile Tilapia, scaled, gutted and chilled. Average fish weight 450–650g. Harvested daily.",
    imageUrl: "https://images.unsplash.com/photo-1649347173558-a305d7b8ff98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aWxhcGlhJTIwZmlzaCUyMHdhdGVyJTIwYXF1YWN1bHR1cmV8ZW58MXx8fHwxNzc0NTQ0MzY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Fresh African Catfish (Live/Fresh)",
    category: "fish",
    price: 420,
    unit: "per kg",
    stock: 620,
    description: "Firm-fleshed African Sharptooth Catfish (Clarias gariepinus), raised in pristine recirculating freshwater ponds.",
    imageUrl: "https://images.unsplash.com/photo-1607629194620-a9726803827c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMGhhcnZlc3QlMjBmcmVzaCUyMGZpc2glMjB3b3JrZXJzfGVufDF8fHx8MTc3NDU0NDM4MXww&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Premium Rainbow Trout Fillets",
    category: "fish",
    price: 750,
    unit: "per kg",
    stock: 240,
    description: "Cold-water premium trout fillets, rich in Omega-3 fatty acids and heart-healthy nutrients. Boneless and skin-on.",
    imageUrl: "https://images.unsplash.com/photo-1770529882297-d60092c0c834?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaHdhdGVyJTIwZmlzaCUyMGNhcnAlMjBwb25kJTIwc3VyZmFjZXxlbnwxfHx8fDE3NzQ1NDQzODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Smoked African Catfish (Traditional)",
    category: "fish",
    price: 550,
    unit: "per kg",
    stock: 180,
    description: "Hardwood slow-smoked catfish with golden-brown finish and rich aroma. Long shelf life, ideal for soups and stews.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Jumbo Tilapia Lake Victoria Cut",
    category: "fish",
    price: 450,
    unit: "per kg",
    stock: 350,
    description: "Extra large premium whole tilapia (800g–1.2kg per fish). Perfect for whole frying and BBQ platters.",
    imageUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },

  // ─── Fingerlings & Seed Stock ───────────────────────────────────────────────
  {
    name: "Monosex Male Tilapia Fingerlings (100 pcs)",
    category: "fingerlings",
    price: 1500,
    unit: "per 100",
    stock: 120,
    description: "Certified 99% monosex male fast-growing fingerlings (3–5cm). Disease-resistant, high survival rate.",
    imageUrl: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Commercial Tilapia Bulk Stock (500 pcs)",
    category: "fingerlings",
    price: 6500,
    unit: "per 500",
    stock: 50,
    description: "Commercial starter batch of 500 vaccinated Nile Tilapia fingerlings. Includes free oxygenated transport bags.",
    imageUrl: "https://images.unsplash.com/photo-1758854486625-2ef3d73853fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcG9uaWNzJTIwd2F0ZXIlMjB0ZWNobm9sb2d5JTIwZmlzaCUyMHRhbmt8ZW58MXx8fHwxNzc0NTQ0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "African Catfish Fingerlings (100 pcs)",
    category: "fingerlings",
    price: 1800,
    unit: "per 100",
    stock: 90,
    description: "Hardy 5–7cm Clarias gariepinus fingerlings. Fast growth rate reaching 1kg in under 6 months under optimal feeding.",
    imageUrl: "https://images.unsplash.com/photo-1758854486625-2ef3d73853fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcG9uaWNzJTIwd2F0ZXIlMjB0ZWNobm9sb2d5JTIwZmlzaCUyMHRhbmt8ZW58MXx8fHwxNzc0NTQ0Mzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Ornamental Koi & Goldfish Fingerlings (20 pcs)",
    category: "fingerlings",
    price: 2400,
    unit: "per 20",
    stock: 45,
    description: "Vibrant multi-colored Japanese Koi and Comet goldfish fingerlings for decorative outdoor garden ponds and aquariums.",
    imageUrl: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },

  // ─── Fish Feeds & Nutrition ────────────────────────────────────────────────
  {
    name: "Aquafarm Floating Pellets 32% (20kg Bag)",
    category: "feed",
    price: 3400,
    unit: "per bag",
    stock: 220,
    description: "Complete grow-out floating feed formulated with marine fish meal, soybean protein, vitamins, and trace minerals (3mm pellet size).",
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "High-Protein Grower Pellets 38% (5kg Bag)",
    category: "feed",
    price: 1100,
    unit: "per bag",
    stock: 310,
    description: "High-efficiency floating feed for juvenile fish and intensive culture systems. Maximizes Feed Conversion Ratio (FCR).",
    imageUrl: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Micro Starter Crumbles 45% (2kg)",
    category: "feed",
    price: 750,
    unit: "per bag",
    stock: 160,
    description: "Ultra-fine starter diet designed for fry and fingerlings up to 15g. High digestibility with fortified vitamin C.",
    imageUrl: "https://images.unsplash.com/photo-1738508041350-03453c14811c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZmFybSUyMHBvbmQlMjBhZXJpYWwlMjBLZW55YXxlbnwxfHx8fDE3NzQ1NDQzNjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Broodstock Conditioning Pellets 40% (10kg)",
    category: "feed",
    price: 2800,
    unit: "per bag",
    stock: 75,
    description: "Specialized breeding feed enriched with spirulina and essential fatty acids to boost egg quality and fry vitality.",
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },

  // ─── Fishing Rods & Reels ──────────────────────────────────────────────────
  {
    name: "Beginner Fishing Rod & Reel Combo",
    category: "rods",
    price: 2600,
    unit: "per set",
    stock: 65,
    description: "Complete entry-level combo — 1.8m fiberglass rod, pre-spooled spinning reel, line, floats, and basic hook pack.",
    imageUrl: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Pro Angler Carbon Fiber 2.4m Rod",
    category: "rods",
    price: 8900,
    unit: "per piece",
    stock: 35,
    description: "Ultra-lightweight IM7 carbon blank with titanium oxide guides and ergonomic cork handle for tournament-grade casting.",
    imageUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Heavy-Duty Catfish Spinning Combo 3.0m",
    category: "rods",
    price: 6800,
    unit: "per set",
    stock: 40,
    description: "Rugged heavy-power rod with reinforced aluminum spool reel (5.2:1 gear ratio). Engineered to land 15kg+ catfish.",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Telescopic Travel Fishing Rod Kit",
    category: "rods",
    price: 3800,
    unit: "per kit",
    stock: 50,
    description: "Compact telescopic rod collapsible to 42cm. Includes hard carry case, spare spool, and multi-lure box.",
    imageUrl: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },

  // ─── Tackle & Bait ──────────────────────────────────────────────────────────
  {
    name: "Assorted High-Carbon Hooks (100 pcs)",
    category: "tackle",
    price: 450,
    unit: "per pack",
    stock: 250,
    description: "Box of 100 chemical-sharpened barbless & barbed hooks in sizes #2 to #12. Corrosion-resistant black nickel finish.",
    imageUrl: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoaW5nJTIwZXF1aXBtZW50JTIwc3RvcmUlMjB0YWNrbGUlMjByb2RzfGVufDF8fHx8MTc3NDU0NDM3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Artificial Lure Collection (12 pcs)",
    category: "tackle",
    price: 1450,
    unit: "per set",
    stock: 85,
    description: "12 holographic crankbaits, poppers, and soft plastic minnows with 3D eyes. Deadly action for bass, tilapia, and trout.",
    imageUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Monofilament Heavy Fishing Line (300m)",
    category: "tackle",
    price: 650,
    unit: "per spool",
    stock: 140,
    description: "High abrasion resistance clear monofilament line with 25lb breaking strength and minimal stretch.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Scented Catfish Dough Bait (500g)",
    category: "tackle",
    price: 500,
    unit: "per tub",
    stock: 110,
    description: "Strong blood & cheese formulated dough bait that stays firmly on the hook and disperses scent trails in murkier waters.",
    imageUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },

  // ─── Accessories & Farm Equipment ──────────────────────────────────────────
  {
    name: "Waterproof Fishing Hat & UV Gloves",
    category: "accessories",
    price: 850,
    unit: "per set",
    stock: 130,
    description: "UPF 50+ sun protection wide-brim hat with neck flap paired with non-slip breathable fingerless fishing gloves.",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Digital Water pH & Temperature Pen",
    category: "accessories",
    price: 2200,
    unit: "per unit",
    stock: 60,
    description: "High-accuracy digital LCD meter for instant measurement of water pH (0-14) and temperature. Crucial for pond health.",
    imageUrl: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Heavy-Duty Rubberized Fish Landing Net",
    category: "accessories",
    price: 1600,
    unit: "per piece",
    stock: 70,
    description: "Tangle-free rubber coated mesh that protects fish slime coat during harvesting and sport fishing catch-and-release.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Solar Pond Aerator Kit (12V DC)",
    category: "accessories",
    price: 12500,
    unit: "per kit",
    stock: 25,
    description: "Eco-friendly solar powered air pump with dual air stones and 20W solar panel. Prevents night-time dissolved oxygen drops.",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    status: ProductStatus.AVAILABLE,
  },
];

export const seedDefaultProducts = async (): Promise<void> => {
  try {
    for (const p of defaultStoreCatalog) {
      const existing = await prisma.product.findFirst({
        where: { name: p.name },
      });

      if (existing) {
        // If existing product has 0 or low stock, replenish to healthy levels
        if (existing.stock <= 0) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              stock: p.stock,
              status: ProductStatus.AVAILABLE,
              price: p.price,
              imageUrl: existing.imageUrl || p.imageUrl,
            },
          });
          console.log(`[Seed] Restocked product: ${p.name} -> ${p.stock} units.`);
        }
      } else {
        await prisma.product.create({ data: p });
        console.log(`[Seed] Created new catalog item: ${p.name} (${p.category})`);
      }
    }

    console.log(`[Seed] Product catalog check completed. Total catalog items verified: ${defaultStoreCatalog.length}.`);
  } catch (error) {
    console.error('[Seed] Error seeding default products:', error);
  }
};
