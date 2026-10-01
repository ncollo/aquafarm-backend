import dotenv from 'dotenv';
dotenv.config();
import { imagekit } from '../config/imagekit';
import prisma from '../config/prisma';
import { ProductStatus } from '@prisma/client';

export interface CatalogItemDefinition {
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  description: string;
  fileName: string;
  sourceUrl: string;
  status: ProductStatus;
}

export const catalogItemsToSync: CatalogItemDefinition[] = [
  // ─── Fresh Fish ─────────────────────────────────────────────────────────────
  {
    name: "Fresh Nile Tilapia (Whole Cleaned)",
    category: "fish",
    price: 380,
    unit: "per kg",
    stock: 850,
    description: "Farm-fresh whole Nile Tilapia (Oreochromis niloticus), scaled, gutted and chilled. Average fish weight 450–650g. Harvested daily from fresh ponds.",
    fileName: "fresh_nile_tilapia.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Fresh African Catfish (Live/Fresh)",
    category: "fish",
    price: 420,
    unit: "per kg",
    stock: 620,
    description: "Firm-fleshed African Sharptooth Catfish (Clarias gariepinus), raised in pristine freshwater recirculating ponds with zero off-flavor.",
    fileName: "fresh_african_catfish.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Premium Rainbow Trout Fillets",
    category: "fish",
    price: 750,
    unit: "per kg",
    stock: 240,
    description: "Cold-water premium trout fillets (Oncorhynchus mykiss), rich in Omega-3 fatty acids and heart-healthy nutrients. Boneless and skin-on.",
    fileName: "rainbow_trout_fillets.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Smoked African Catfish (Traditional)",
    category: "fish",
    price: 550,
    unit: "per kg",
    stock: 180,
    description: "Hardwood slow-smoked African catfish with golden-brown finish and rich woodsmoke aroma. Extended shelf life, ideal for African soups and stews.",
    fileName: "smoked_african_catfish.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Jumbo Tilapia Lake Victoria Cut",
    category: "fish",
    price: 450,
    unit: "per kg",
    stock: 350,
    description: "Extra large premium whole Nile Tilapia (800g–1.2kg per fish). Cleaned and prepped, perfect for whole deep frying and BBQ platters.",
    fileName: "jumbo_tilapia_victoria.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },

  // ─── Fingerlings & Seed Stock ───────────────────────────────────────────────
  {
    name: "Monosex Male Tilapia Fingerlings (100 pcs)",
    category: "fingerlings",
    price: 1500,
    unit: "per 100",
    stock: 120,
    description: "Certified 99% monosex male fast-growing fingerlings (3–5cm). Disease-resistant, high survival rate, optimized for pond and tank farming.",
    fileName: "tilapia_fingerlings_100.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Commercial Tilapia Bulk Stock (500 pcs)",
    category: "fingerlings",
    price: 6500,
    unit: "per 500",
    stock: 50,
    description: "Commercial starter batch of 500 vaccinated Nile Tilapia fingerlings. Includes free oxygenated transport bags for safe countrywide transit.",
    fileName: "commercial_tilapia_bulk_500.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "African Catfish Fingerlings (100 pcs)",
    category: "fingerlings",
    price: 1800,
    unit: "per 100",
    stock: 90,
    description: "Hardy 5–7cm Clarias gariepinus fingerlings. Fast growth rate reaching 1kg market size in under 6 months under optimal feeding regimen.",
    fileName: "catfish_fingerlings_100.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Ornamental Koi & Goldfish Fingerlings (20 pcs)",
    category: "fingerlings",
    price: 2400,
    unit: "per 20",
    stock: 45,
    description: "Vibrant multi-colored Japanese Koi and Comet goldfish fingerlings for decorative outdoor garden ponds, hotels, and aquariums.",
    fileName: "ornamental_koi_goldfish.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1080&auto=format&fit=crop",
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
    fileName: "floating_feed_pellets_32_20kg.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "High-Protein Grower Pellets 38% (5kg Bag)",
    category: "feed",
    price: 1100,
    unit: "per bag",
    stock: 310,
    description: "High-efficiency floating feed for juvenile fish and intensive culture systems. Maximizes Feed Conversion Ratio (FCR).",
    fileName: "grower_pellets_38_5kg.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Micro Starter Crumbles 45% (2kg)",
    category: "feed",
    price: 750,
    unit: "per bag",
    stock: 160,
    description: "Ultra-fine starter diet designed for fry and fingerlings up to 15g. High digestibility with fortified vitamin C and bio-available minerals.",
    fileName: "micro_starter_crumbles_2kg.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Broodstock Conditioning Pellets 40% (10kg)",
    category: "feed",
    price: 2800,
    unit: "per bag",
    stock: 75,
    description: "Specialized breeding feed enriched with spirulina and essential fatty acids to boost egg quality, hatchability, and fry vitality.",
    fileName: "broodstock_conditioning_pellets.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },

  // ─── Fishing Rods & Reels ──────────────────────────────────────────────────
  {
    name: "Beginner Fishing Rod & Reel Combo",
    category: "rods",
    price: 2600,
    unit: "per set",
    stock: 65,
    description: "Complete entry-level combo — 1.8m fiberglass rod, pre-spooled spinning reel, line, floats, and basic tackle pack.",
    fileName: "beginner_rod_reel_combo.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1695035711091-0658605fe1d6?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Pro Angler Carbon Fiber 2.4m Rod",
    category: "rods",
    price: 8900,
    unit: "per piece",
    stock: 35,
    description: "Ultra-lightweight IM7 carbon blank with titanium oxide guides and ergonomic cork handle for tournament-grade casting performance.",
    fileName: "pro_angler_carbon_rod.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Heavy-Duty Catfish Spinning Combo 3.0m",
    category: "rods",
    price: 6800,
    unit: "per set",
    stock: 40,
    description: "Rugged heavy-power rod with reinforced aluminum spool reel (5.2:1 gear ratio). Engineered to land 15kg+ catfish and big lake predators.",
    fileName: "heavy_duty_catfish_combo.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Telescopic Travel Fishing Rod Kit",
    category: "rods",
    price: 3800,
    unit: "per kit",
    stock: 50,
    description: "Compact telescopic rod collapsible to 42cm. Includes hard carry case, spare spool, and multi-lure terminal tackle box.",
    fileName: "telescopic_travel_fishing_rod.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=1080&auto=format&fit=crop",
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
    fileName: "high_carbon_fishing_hooks.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Artificial Lure Collection (12 pcs)",
    category: "tackle",
    price: 1450,
    unit: "per set",
    stock: 85,
    description: "12 holographic crankbaits, topwater poppers, and soft plastic minnows with 3D eyes. Deadly action for bass, tilapia, and trout.",
    fileName: "artificial_lure_collection_12.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Monofilament Heavy Fishing Line (300m)",
    category: "tackle",
    price: 650,
    unit: "per spool",
    stock: 140,
    description: "High abrasion resistance clear monofilament line with 25lb breaking strength, smooth spooling, and minimal memory.",
    fileName: "monofilament_heavy_line_300m.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Scented Catfish Dough Bait (500g)",
    category: "tackle",
    price: 500,
    unit: "per tub",
    stock: 110,
    description: "Strong blood & cheese formulated dough bait that stays firmly on the hook and disperses long-lasting scent trails in murkier waters.",
    fileName: "scented_catfish_dough_bait.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=1080&auto=format&fit=crop",
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
    fileName: "fishing_hat_uv_gloves_set.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Digital Water pH & Temperature Pen",
    category: "accessories",
    price: 2200,
    unit: "per unit",
    stock: 60,
    description: "High-accuracy digital LCD meter for instant measurement of water pH (0-14) and temperature. Crucial for aquaculture pond health.",
    fileName: "digital_ph_water_meter.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Heavy-Duty Rubberized Fish Landing Net",
    category: "accessories",
    price: 1600,
    unit: "per piece",
    stock: 70,
    description: "Tangle-free rubber coated mesh that protects fish slime coat during harvesting and sport fishing catch-and-release.",
    fileName: "rubberized_landing_net.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
  {
    name: "Solar Pond Aerator Kit (12V DC)",
    category: "accessories",
    price: 12500,
    unit: "per kit",
    stock: 25,
    description: "Eco-friendly solar powered air pump with dual air stones and 20W solar panel. Prevents night-time dissolved oxygen drops.",
    fileName: "solar_pond_aerator_kit.jpg",
    sourceUrl: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1080&auto=format&fit=crop",
    status: ProductStatus.AVAILABLE,
  },
];

export async function uploadCatalogToImageKit() {
  console.log(`Starting ImageKit upload process for ${catalogItemsToSync.length} catalog items...`);
  const uploadedResults: Array<{ name: string; imageKitUrl: string }> = [];

  for (const item of catalogItemsToSync) {
    try {
      console.log(`Uploading to ImageKit: [${item.name}] (${item.fileName})...`);
      const uploadResponse = await imagekit.upload({
        file: item.sourceUrl,
        fileName: item.fileName,
        folder: '/aquafarm/products',
        useUniqueFileName: false,
        tags: ['aquafarm', item.category, 'store_product'],
      });

      console.log(`  ✓ Uploaded: ${uploadResponse.url}`);
      uploadedResults.push({
        name: item.name,
        imageKitUrl: uploadResponse.url,
      });

      // Upsert into Postgres DB via Prisma
      const existing = await prisma.product.findFirst({
        where: { name: item.name },
      });

      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            category: item.category,
            price: item.price,
            unit: item.unit,
            stock: item.stock,
            description: item.description,
            imageUrl: uploadResponse.url,
            status: item.status,
          },
        });
        console.log(`  ✓ Updated DB record with ImageKit URL.`);
      } else {
        await prisma.product.create({
          data: {
            name: item.name,
            category: item.category,
            price: item.price,
            unit: item.unit,
            stock: item.stock,
            description: item.description,
            imageUrl: uploadResponse.url,
            status: item.status,
          },
        });
        console.log(`  ✓ Created new DB record with ImageKit URL.`);
      }
    } catch (err: any) {
      console.error(`  ✗ Error processing ${item.name}:`, err.message || err);
    }
  }

  console.log('\n--- ImageKit Upload & Database Sync Complete ---');
  console.log(`Total successfully processed: ${uploadedResults.length}/${catalogItemsToSync.length}`);
  return uploadedResults;
}

if (require.main === module) {
  uploadCatalogToImageKit()
    .then(() => {
      console.log('Script execution finished successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Fatal script error:', err);
      process.exit(1);
    });
}
