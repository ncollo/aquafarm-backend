export interface ParsedProduct {
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
}

export const parseProductsFromText = (rawText: string): ParsedProduct[] => {
  const products: ParsedProduct[] = [];
  
  // Split the text into an array of lines and remove empty ones
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // This RegEx looks for a pattern roughly like:
  // [Words] [Number] [Word] [Number]
  // e.g., "Tilapia Fingerlings 500 pcs 15.00" or "Catfish Feed 50 kg 2500"
  const itemPattern = /^([a-zA-Z\s\-]+)\s+(\d+(?:\.\d+)?)\s*([a-zA-Z]+)\s+(?:Ksh|KES)?\s*(\d+(?:\.\d+)?)$/i;

  for (const line of lines) {
    const match = line.match(itemPattern);
    
    if (match) {
      const name = match[1].trim();
      const stock = parseFloat(match[2]);
      const unit = match[3].toLowerCase();
      const price = parseFloat(match[4]);

      // Simple auto-categorization based on keywords
      let category = 'equipment';
      if (name.toLowerCase().includes('feed')) category = 'feed';
      if (name.toLowerCase().includes('fingerling') || name.toLowerCase().includes('fish') || name.toLowerCase().includes('tilapia')) category = 'fish';

      products.push({
        name,
        category,
        stock,
        unit,
        price
      });
    }
  }

  return products;
};