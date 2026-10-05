export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  searchQuery: string;
  description: string;
  itemCountEstimated: string;
  popularBrands: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  tagline: string;
  searchQuery: string;
  bannerGradient: string;
  subcategories: SubCategory[];
}

export interface BrandItem {
  id: string;
  name: string;
  firstLetter: string;
  popularCategories: string[];
  searchQuery: string;
  tagline: string;
  origin?: string;
  featured?: boolean;
}

export const CATEGORIES_TREE: Category[] = [
  {
    id: 'appliances',
    name: 'Appliances',
    slug: 'appliances',
    iconName: 'Tv',
    tagline: 'Energy-efficient ACs, refrigerators, smart washing machines & kitchen appliances in India',
    searchQuery: 'best home appliances India deals price',
    bannerGradient: 'from-amber-600 via-orange-600 to-red-600',
    subcategories: [
      {
        id: 'ac',
        name: 'Air Conditioners',
        slug: 'air-conditioners',
        searchQuery: 'best 1.5 ton 5 star inverter split AC India',
        description: 'Split, Window, Inverter ACs from Voltas, Daikin, LG, Lloyd, Blue Star',
        itemCountEstimated: '120+ verified models',
        popularBrands: ['Voltas', 'LG', 'Daikin', 'Blue Star', 'Lloyd'],
      },
      {
        id: 'refrigerators',
        name: 'Refrigerators',
        slug: 'refrigerators',
        searchQuery: 'best double door refrigerator India',
        description: 'Single door, double door, frost-free and side-by-side refrigerators',
        itemCountEstimated: '140+ verified models',
        popularBrands: ['Samsung', 'LG', 'Whirlpool', 'Godrej', 'Haier'],
      },
      {
        id: 'washing-machines',
        name: 'Washing Machines',
        slug: 'washing-machines',
        searchQuery: 'best front load washing machine India',
        description: 'Front load, top load, semi-automatic & fully automatic washers with heater',
        itemCountEstimated: '95+ verified models',
        popularBrands: ['LG', 'Samsung', 'IFB', 'Bosch', 'Whirlpool'],
      },
      {
        id: 'kitchen-appliances',
        name: 'Kitchen Appliances',
        slug: 'kitchen-appliances',
        searchQuery: 'best kitchen appliances mixer grinder air fryer India',
        description: 'Air fryers, mixer grinders, microwave ovens, induction cooktops & juicers',
        itemCountEstimated: '310+ verified models',
        popularBrands: ['Philips', 'Prestige', 'Bajaj', 'Morphy Richards', 'Pigeon'],
      },
    ],
  },
  {
    id: 'automotive',
    name: 'Automotive',
    slug: 'automotive',
    iconName: 'Compass',
    tagline: 'Car accessories, riding helmets, dashcams & tyre inflators with verified links',
    searchQuery: 'car accessories riding gear automotive India',
    bannerGradient: 'from-slate-700 via-zinc-800 to-black',
    subcategories: [
      {
        id: 'car-accessories',
        name: 'Car Accessories',
        slug: 'car-accessories',
        searchQuery: 'car vacuum cleaner tyre inflator mobile holder India',
        description: 'Fast car chargers, magnetic holders, seat cushions & ambient lighting',
        itemCountEstimated: '180+ verified products',
        popularBrands: ['Qubo', 'Portronics', '70mai', 'Bergmann', 'Agaro'],
      },
      {
        id: 'helmets-riding-gear',
        name: 'Helmets & Riding Gear',
        slug: 'helmets-riding-gear',
        searchQuery: 'best ISI DOT motorcycle helmet India',
        description: 'Full-face helmets, riding jackets, touchscreen gloves & knee guards',
        itemCountEstimated: '85+ verified products',
        popularBrands: ['Vega', 'Steelbird', 'Studds', 'SMK', 'Axor'],
      },
      {
        id: 'dash-cams',
        name: 'Dash Cams & Security',
        slug: 'dash-cams',
        searchQuery: 'best dual channel car dash cam India',
        description: 'Night vision, dual-channel, GPS-enabled car dash cameras',
        itemCountEstimated: '45+ verified products',
        popularBrands: ['70mai', 'Qubo', 'DDPAI', 'Redtiger'],
      },
    ],
  },
  {
    id: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    iconName: 'Sparkles',
    tagline: 'Verified skincare, hair care, grooming trimmers & perfumes from authorized sellers',
    searchQuery: 'beauty personal care grooming trimmer India',
    bannerGradient: 'from-pink-500 via-rose-500 to-purple-600',
    subcategories: [
      {
        id: 'skincare',
        name: 'Skincare',
        slug: 'skincare',
        searchQuery: 'best sunscreen moisturizer serum for Indian skin',
        description: 'Sun Protection (SPF 50+), Vitamin C serums, moisturizers & face washes',
        itemCountEstimated: '450+ verified products',
        popularBrands: ['Minimalist', 'The Derma Co', 'Cetaphil', 'Dot & Key', 'Plum'],
      },
      {
        id: 'grooming-trimmers',
        name: 'Men & Women Grooming',
        slug: 'grooming-trimmers',
        searchQuery: 'best beard trimmer hair dryer India',
        description: 'Cordless beard trimmers, hair straighteners, epilators & ionic hair dryers',
        itemCountEstimated: '130+ verified products',
        popularBrands: ['Philips', 'Vega', 'Havells', 'Bombay Shaving Company', 'Beardo'],
      },
      {
        id: 'fragrances',
        name: 'Perfumes & Deodorants',
        slug: 'fragrances',
        searchQuery: 'best long lasting perfume for men women India',
        description: 'Eau de Parfum (EDP), long-lasting body sprays & luxury fragrance sets',
        itemCountEstimated: '210+ verified products',
        popularBrands: ['Titan Skinn', 'Bella Vita', 'Fogg', 'Wild Stone', 'Park Avenue'],
      },
    ],
  },
  {
    id: 'books-stationery',
    name: 'Books & Stationery',
    slug: 'books-stationery',
    iconName: 'Compass',
    tagline: 'Bestselling paperbacks, competitive exam prep, notebooks & premium writing instruments',
    searchQuery: 'bestselling books stationery fountain pens India',
    bannerGradient: 'from-amber-700 via-yellow-800 to-stone-900',
    subcategories: [
      {
        id: 'bestsellers-fiction',
        name: 'Bestselling Books',
        slug: 'bestsellers-fiction',
        searchQuery: 'bestselling novels self help fiction books India',
        description: 'Self-help, Indian literature, international fiction & business bestsellers',
        itemCountEstimated: '800+ verified books',
        popularBrands: ['Penguin', 'HarperCollins', 'Rupa', 'Bloomsbury', 'Westland'],
      },
      {
        id: 'stationery-supplies',
        name: 'Pens & Office Notebooks',
        slug: 'stationery-supplies',
        searchQuery: 'fountain pens bullet journals premium notebooks India',
        description: 'Hardcover journals, rollerball pens, calligraphy pens & desk accessories',
        itemCountEstimated: '190+ verified products',
        popularBrands: ['Parker', 'Lamy', 'Classmate', 'Factor Notes', 'Pilot'],
      },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    iconName: 'Laptop',
    tagline: '5G Smartphones, M3/Intel Core Laptops, OLED TVs, ANC headphones & wearables in India',
    searchQuery: 'best electronics gadgets laptops smartphones India',
    bannerGradient: 'from-indigo-600 via-purple-600 to-violet-700',
    subcategories: [
      {
        id: 'mobiles',
        name: 'Mobiles & 5G Smartphones',
        slug: 'mobiles',
        searchQuery: 'best 5g smartphone India deals price',
        description: 'Budget phones under ₹20k, mid-range killers & flagship camera phones',
        itemCountEstimated: '240+ verified models',
        popularBrands: ['OnePlus', 'Samsung', 'Apple', 'Xiaomi', 'Realme', 'iQOO', 'Motorola'],
      },
      {
        id: 'laptops',
        name: 'Laptops & Ultrabooks',
        slug: 'laptops',
        searchQuery: 'best laptop for coding office gaming India',
        description: 'Thin & light ultrabooks, student laptops, Apple MacBooks & RTX gaming rigs',
        itemCountEstimated: '175+ verified models',
        popularBrands: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'],
      },
      {
        id: 'tablets',
        name: 'Tablets & iPads',
        slug: 'tablets',
        searchQuery: 'best android tablet ipad with stylus India',
        description: 'Drawing tablets, student e-learning pads & Apple iPad series',
        itemCountEstimated: '60+ verified models',
        popularBrands: ['Apple', 'Samsung', 'Lenovo', 'Xiaomi', 'OnePlus'],
      },
      {
        id: 'tvs',
        name: 'Smart TVs & Soundbars',
        slug: 'smart-tvs',
        searchQuery: 'best 4k 55 inch smart tv dolby atmos India',
        description: '4K Ultra HD, QLED, OLED, Google TV with Dolby Vision & Atmos soundbars',
        itemCountEstimated: '110+ verified models',
        popularBrands: ['Sony', 'Samsung', 'LG', 'Xiaomi', 'TCL', 'Vu'],
      },
      {
        id: 'audio',
        name: 'Audio & ANC Headphones',
        slug: 'audio',
        searchQuery: 'best tws earbuds active noise cancelling headphones India',
        description: 'True Wireless (TWS) earbuds, over-ear ANC headphones & party speakers',
        itemCountEstimated: '320+ verified models',
        popularBrands: ['Sony', 'boAt', 'JBL', 'OnePlus', 'Realme', 'Sennheiser', 'Bose'],
      },
      {
        id: 'cameras',
        name: 'Cameras & Vlogging',
        slug: 'cameras',
        searchQuery: 'best mirrorless camera vlogging 4k India',
        description: 'Mirrorless cameras, action cams (GoPro), vlogging kits & gimbal stabilizers',
        itemCountEstimated: '48+ verified models',
        popularBrands: ['Sony', 'Canon', 'Nikon', 'GoPro', 'DJI'],
      },
      {
        id: 'wearables',
        name: 'Wearables & Smartwatches',
        slug: 'wearables',
        searchQuery: 'best smartwatch with amoled display bluetooth calling India',
        description: 'Bluetooth calling smartwatches, GPS sports watches & smart fitness rings',
        itemCountEstimated: '190+ verified models',
        popularBrands: ['Noise', 'Fire-Boltt', 'boAt', 'Apple', 'Samsung', 'Amazfit'],
      },
      {
        id: 'gaming',
        name: 'Gaming Gear & Consoles',
        slug: 'gaming',
        searchQuery: 'ps5 accessories mechanical gaming keyboard mouse India',
        description: 'PlayStation 5 consoles, mechanical RGB keyboards, gaming mice & headsets',
        itemCountEstimated: '140+ verified models',
        popularBrands: ['Sony PS5', 'Logitech G', 'Razer', 'Cosmic Byte', 'Keychron'],
      },
      {
        id: 'accessories',
        name: 'Accessories & Chargers',
        slug: 'computer-accessories',
        searchQuery: 'best 65w gan charger power bank usb c hub India',
        description: 'GaN fast chargers, 20000mAh power banks, multiport Type-C hubs & cables',
        itemCountEstimated: '280+ verified products',
        popularBrands: ['Anker', 'Mi', 'Portronics', 'Spigen', 'Ambrane'],
      },
      {
        id: 'networking',
        name: 'Networking & WiFi',
        slug: 'networking-wifi',
        searchQuery: 'best wifi 6 mesh router range extender India',
        description: 'WiFi 6 routers, gigabit mesh systems & high-gain range extenders',
        itemCountEstimated: '55+ verified products',
        popularBrands: ['TP-Link', 'Netgear', 'D-Link', 'Mercusys'],
      },
    ],
  },
  {
    id: 'fashion-kids',
    name: "Kids' Fashion",
    slug: 'kids-fashion',
    iconName: 'Tag',
    tagline: 'Comfortable pure cotton clothing, school footwear & playful accessories for children',
    searchQuery: 'kids clothing shoes fashion wear India',
    bannerGradient: 'from-cyan-500 via-teal-500 to-emerald-600',
    subcategories: [
      {
        id: 'kids-clothing',
        name: 'Kids Clothes & Sets',
        slug: 'kids-clothing',
        searchQuery: 'kids cotton clothes sets boys girls India',
        description: 'Soft organic cotton tops, dungarees, nightwear sets & festive partywear',
        itemCountEstimated: '350+ verified products',
        popularBrands: ['Hopscotch', 'Max', 'FirstCry', 'Mothercare', 'H&M'],
      },
      {
        id: 'kids-footwear',
        name: 'Kids Shoes & Sandals',
        slug: 'kids-footwear',
        searchQuery: 'kids lightweight running shoes clogs India',
        description: 'Lightweight sneakers, school shoes, non-slip clogs & floaters',
        itemCountEstimated: '120+ verified products',
        popularBrands: ['Crocs', 'Liberty', 'Bata', 'Puma Kids', 'Khadim'],
      },
    ],
  },
  {
    id: 'fashion-men',
    name: "Men's Fashion",
    slug: 'mens-fashion',
    iconName: 'Tag',
    tagline: 'Breathable shirts, raw denim, running sneakers, leather wallets & chronograph watches',
    searchQuery: 'mens shirts sneakers jeans watches India',
    bannerGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    subcategories: [
      {
        id: 'mens-clothing',
        name: 'Shirts & T-Shirts',
        slug: 'mens-clothing',
        searchQuery: 'mens casual cotton shirt polo t-shirt India',
        description: 'Pure linen casual shirts, oversized graphic tees & formal office shirts',
        itemCountEstimated: '480+ verified products',
        popularBrands: ['Snitch', 'The Souled Store', 'US Polo', 'Louis Philippe', 'Levis'],
      },
      {
        id: 'mens-footwear',
        name: 'Sneakers & Shoes',
        slug: 'mens-footwear',
        searchQuery: 'best running sneakers formal leather shoes men India',
        description: 'Casual streetwear sneakers, running shoes & genuine leather oxfords',
        itemCountEstimated: '290+ verified products',
        popularBrands: ['Nike', 'Puma', 'Adidas', 'Bata', 'Red Tape', 'Woodland'],
      },
      {
        id: 'mens-watches',
        name: 'Men Watches & Wallets',
        slug: 'mens-watches',
        searchQuery: 'mens analog chronograph watch genuine leather wallet India',
        description: 'Stainless steel analog chronographs, minimal slim wallets & belts',
        itemCountEstimated: '160+ verified products',
        popularBrands: ['Titan', 'Fastrack', 'Casio', 'Fossil', 'Tommy Hilfiger'],
      },
      {
        id: 'mens-bags',
        name: 'Backpacks & Duffles',
        slug: 'mens-bags',
        searchQuery: 'waterproof laptop backpack gym duffle bag India',
        description: 'Ergonomic waterproof laptop bags, weekend duffles & messenger bags',
        itemCountEstimated: '110+ verified products',
        popularBrands: ['Wildcraft', 'American Tourister', 'Safari', 'Mokobara'],
      },
    ],
  },
  {
    id: 'fashion-women',
    name: "Women's Fashion",
    slug: 'womens-fashion',
    iconName: 'Sparkles',
    tagline: 'Handloom kurtas, western dresses, ethnic jewellery, stylish heels & designer tote bags',
    searchQuery: 'womens kurta ethnic dress jewellery handbags India',
    bannerGradient: 'from-fuchsia-600 via-rose-600 to-purple-800',
    subcategories: [
      {
        id: 'womens-ethnic',
        name: 'Kurtas & Ethnic Sets',
        slug: 'womens-ethnic',
        searchQuery: 'womens cotton kurta palazzo set dupatta India',
        description: 'Chanderi & cotton kurtas, Anarkalis, sharara sets & festive sarees',
        itemCountEstimated: '520+ verified products',
        popularBrands: ['Biba', 'W for Woman', 'Aurelia', 'Libas', 'Global Desi'],
      },
      {
        id: 'womens-western',
        name: 'Western Dresses & Tops',
        slug: 'womens-western',
        searchQuery: 'womens western dresses floral tops casual jeans India',
        description: 'Midi dresses, blazers, high-waisted denims & breathable summer tops',
        itemCountEstimated: '380+ verified products',
        popularBrands: ['Zara', 'H&M', 'Vero Moda', 'Marks & Spencer', 'AND'],
      },
      {
        id: 'womens-jewellery',
        name: 'Jewellery & Watches',
        slug: 'womens-jewellery',
        searchQuery: 'womens oxidized silver jewellery rose gold watch India',
        description: 'Oxidized silver earrings, anti-tarnish stainless steel necklaces & watches',
        itemCountEstimated: '240+ verified products',
        popularBrands: ['Giva', 'Zaveri Pearls', 'Titan Raga', 'Daniel Wellington'],
      },
      {
        id: 'womens-bags',
        name: 'Handbags & Totes',
        slug: 'womens-handbags',
        searchQuery: 'womens shoulder handbag leather tote bag India',
        description: 'Structured totes, crossbody bags, clutches & travel wallets',
        itemCountEstimated: '190+ verified products',
        popularBrands: ['Lavie', 'Caprese', 'Baggit', 'Zouk', 'Lino Perros'],
      },
    ],
  },
  {
    id: 'grocery-essentials',
    name: 'Grocery & Essentials',
    slug: 'grocery-essentials',
    iconName: 'ShoppingCart',
    tagline: 'Gourmet coffee, premium dry fruits, organic green teas & healthy daily essentials',
    searchQuery: 'grocery dry fruits coffee green tea olive oil India',
    bannerGradient: 'from-emerald-600 via-green-700 to-teal-800',
    subcategories: [
      {
        id: 'coffee-tea',
        name: 'Gourmet Coffee & Tea',
        slug: 'coffee-tea',
        searchQuery: 'filter coffee french roast green tea organic India',
        description: 'South Indian filter coffee, whole roasted Arabica beans & Darjeeling green tea',
        itemCountEstimated: '140+ verified products',
        popularBrands: ['Blue Tokai', 'Sleepy Owl', 'Tata Coffee', 'Organic India', 'Twinings'],
      },
      {
        id: 'dry-fruits-nuts',
        name: 'Dry Fruits & Seeds',
        slug: 'dry-fruits-nuts',
        searchQuery: 'california almonds cashews walnuts chia seeds India',
        description: 'California almonds, raw chia & pumpkin seeds, Afghan walnuts & raisins',
        itemCountEstimated: '160+ verified products',
        popularBrands: ['Happilo', 'Nutraj', 'Farmley', 'True Elements'],
      },
    ],
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    slug: 'health-wellness',
    iconName: 'ShieldCheck',
    tagline: 'Digital BP monitors, smart weighing scales, whey proteins & multivitamins in India',
    searchQuery: 'health wellness bp monitor weighing scale protein India',
    bannerGradient: 'from-teal-600 via-cyan-700 to-blue-800',
    subcategories: [
      {
        id: 'health-monitors',
        name: 'Health Monitors & Scales',
        slug: 'health-monitors',
        searchQuery: 'digital bp monitor smart body fat weighing scale India',
        description: 'Clinically validated upper-arm BP monitors, pulse oximeters & body fat scales',
        itemCountEstimated: '90+ verified products',
        popularBrands: ['Omron', 'Dr Trust', 'HealthSense', 'Beurer'],
      },
      {
        id: 'nutrition-supplements',
        name: 'Nutrition & Proteins',
        slug: 'nutrition-supplements',
        searchQuery: 'whey protein isolate multivitamin fish oil India',
        description: 'Labdoor certified whey isolate, plant protein, Omega-3 fish oil & vitamins',
        itemCountEstimated: '180+ verified products',
        popularBrands: ['MuscleBlaze', 'Optimum Nutrition', 'HealthKart', 'Fast&Up'],
      },
    ],
  },
  {
    id: 'home-furniture',
    name: 'Home & Furniture',
    slug: 'home-furniture',
    iconName: 'Flame',
    tagline: 'Ergonomic work-from-home chairs, solid Sheesham wood tables & modern mattresses',
    searchQuery: 'home furniture ergonomic office chair study table mattress India',
    bannerGradient: 'from-amber-700 via-orange-800 to-stone-900',
    subcategories: [
      {
        id: 'ergonomic-chairs',
        name: 'Ergonomic Office Chairs',
        slug: 'ergonomic-chairs',
        searchQuery: 'best ergonomic office chair lumbar support mesh India',
        description: 'High-back mesh chairs, adjustable lumbar support & tilt-lock mechanisms',
        itemCountEstimated: '75+ verified models',
        popularBrands: ['Green Soul', 'The Sleep Company', 'Featherlite', 'CELLBELL'],
      },
      {
        id: 'study-tables',
        name: 'Study Desks & Tables',
        slug: 'study-tables',
        searchQuery: 'solid wood study table motorized standing desk India',
        description: 'Motorized height-adjustable desks, compact laptop tables & wood study units',
        itemCountEstimated: '85+ verified models',
        popularBrands: ['Wakefit', 'Jin Office', 'Solimo', 'DeckUp'],
      },
      {
        id: 'mattresses',
        name: 'Mattresses & Bedding',
        slug: 'mattresses',
        searchQuery: 'orthopedic memory foam pocket spring mattress India',
        description: 'Orthopedic memory foam, smartgrid technology & dual-comfort king size mattresses',
        itemCountEstimated: '65+ verified models',
        popularBrands: ['Wakefit', 'The Sleep Company', 'Sleepwell', 'Duroflex'],
      },
    ],
  },
  {
    id: 'musical-instruments',
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    iconName: 'Zap',
    tagline: 'Acoustic guitars, digital synthesizers, studio USB microphones & audio interfaces',
    searchQuery: 'acoustic guitar digital keyboard studio mic India',
    bannerGradient: 'from-violet-700 via-purple-800 to-indigo-900',
    subcategories: [
      {
        id: 'guitars',
        name: 'Acoustic & Electric Guitars',
        slug: 'guitars',
        searchQuery: 'best acoustic guitar for beginners India',
        description: 'Cutaway acoustic guitars, semi-acoustic with pickups & guitar tuner bundles',
        itemCountEstimated: '60+ verified models',
        popularBrands: ['Yamaha', 'Fender', 'Juarez', 'Kadence', 'Ibanez'],
      },
      {
        id: 'keyboards-audio',
        name: 'Keyboards & Studio Microphones',
        slug: 'keyboards-audio',
        searchQuery: '61 key digital piano condenser usb microphone India',
        description: '61-key electronic keyboards, touch-sensitive synthesizers & podcasting mics',
        itemCountEstimated: '50+ verified models',
        popularBrands: ['Casio', 'Yamaha', 'Rode', 'Shure', 'Maono', 'Audio-Technica'],
      },
    ],
  },
  {
    id: 'office-industrial',
    name: 'Office & Industrial',
    slug: 'office-industrial',
    iconName: 'Layers',
    tagline: 'All-in-one wireless laser printers, document shredders & barcode scanners',
    searchQuery: 'all in one wireless laser printer document scanner office India',
    bannerGradient: 'from-slate-600 via-gray-700 to-zinc-800',
    subcategories: [
      {
        id: 'printers',
        name: 'Printers & Scanners',
        slug: 'printers-scanners',
        searchQuery: 'all in one ink tank wireless wifi printer India',
        description: 'High-yield ink tank printers, auto duplex laser printers & flatbed scanners',
        itemCountEstimated: '55+ verified models',
        popularBrands: ['HP', 'Canon', 'Epson', 'Brother'],
      },
      {
        id: 'office-electronics',
        name: 'Shredders & Projectors',
        slug: 'shredders-projectors',
        searchQuery: 'cross cut paper shredder 1080p smart projector India',
        description: 'Cross-cut security shredders, wireless conference projectors & laminators',
        itemCountEstimated: '40+ verified products',
        popularBrands: ['Fellowes', 'Egate', 'WANBO', 'SToK'],
      },
    ],
  },
  {
    id: 'pet-supplies',
    name: 'Pet Supplies',
    slug: 'pet-supplies',
    iconName: 'Heart',
    tagline: 'Vet-recommended dry dog food, cat treats, grooming brushes & orthopedic pet beds',
    searchQuery: 'pet dog food cat treats grooming bed India',
    bannerGradient: 'from-amber-600 via-yellow-700 to-stone-800',
    subcategories: [
      {
        id: 'dog-food',
        name: 'Dog Food & Treats',
        slug: 'dog-food',
        searchQuery: 'best dry dog food puppy adult grain free India',
        description: 'High-protein kibble, raw chew sticks, calcium bones & dental treats',
        itemCountEstimated: '110+ verified products',
        popularBrands: ['Pedigree', 'Royal Canin', 'Drools', 'Farmina N&D', 'Purepet'],
      },
      {
        id: 'cat-supplies',
        name: 'Cat Food & Accessories',
        slug: 'cat-supplies',
        searchQuery: 'cat wet food ocean fish clumping bentonite litter India',
        description: 'Wet gravies, crunchy treats, odor-control bentonite litter & scratching posts',
        itemCountEstimated: '75+ verified products',
        popularBrands: ['Whiskas', 'Sheba', 'Drools Cat', 'Me-O'],
      },
    ],
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    iconName: 'Compass',
    tagline: 'Anti-skid yoga mats, adjustable hex dumbbells, resistance bands & carbon badminton rackets',
    searchQuery: 'sports fitness yoga mat dumbbells resistance bands India',
    bannerGradient: 'from-emerald-700 via-teal-800 to-cyan-900',
    subcategories: [
      {
        id: 'gym-equipment',
        name: 'Home Gym & Dumbbells',
        slug: 'gym-equipment',
        searchQuery: 'adjustable hex dumbbells rubber coated resistance bands India',
        description: 'Hex rubber dumbbells, pull-up bars, latex resistance loops & gym benches',
        itemCountEstimated: '130+ verified products',
        popularBrands: ['Kore', 'Cockatoo', 'Boldfit', 'Burnlab', 'Cultsport'],
      },
      {
        id: 'yoga-sports',
        name: 'Yoga & Rackets',
        slug: 'yoga-sports',
        searchQuery: 'extra thick tpe yoga mat carbon graphite badminton racket India',
        description: '6mm/8mm dual-tone TPE yoga mats, carbon graphite badminton rackets & shuttlecocks',
        itemCountEstimated: '150+ verified products',
        popularBrands: ['Yonex', 'Li-Ning', 'Strauss', 'WiseLife', 'Nivia'],
      },
    ],
  },
  {
    id: 'toys-baby',
    name: 'Toys & Baby',
    slug: 'toys-baby',
    iconName: 'Sparkles',
    tagline: 'STEM building kits, remote-controlled cars, educational puzzles & baby strollers',
    searchQuery: 'stem educational toys building sets remote control car India',
    bannerGradient: 'from-orange-500 via-amber-500 to-yellow-600',
    subcategories: [
      {
        id: 'educational-toys',
        name: 'STEM & Building Toys',
        slug: 'educational-toys',
        searchQuery: 'lego building blocks stem educational science kit India',
        description: 'Lego compatible architectural blocks, robotic science kits & 100-piece puzzles',
        itemCountEstimated: '180+ verified products',
        popularBrands: ['Lego', 'Smartivity', 'Skillmatics', 'Funskool'],
      },
      {
        id: 'baby-gear',
        name: 'Baby Strollers & Walkers',
        slug: 'baby-gear',
        searchQuery: 'lightweight foldable baby stroller pram India',
        description: 'One-hand compact folding strollers, high chairs & activity baby walkers',
        itemCountEstimated: '70+ verified products',
        popularBrands: ['LuvLap', 'R for Rabbit', 'Chicco', 'Mee Mee'],
      },
    ],
  },
];

export const BRANDS_DIRECTORY: BrandItem[] = [
  { id: 'apple', name: 'Apple', firstLetter: 'A', popularCategories: ['Smartphones', 'Laptops', 'Tablets', 'Wearables', 'Audio'], searchQuery: 'Apple iPhone MacBook iPad Apple Watch AirPods India', tagline: 'Premium iOS, M-series Silicon MacBooks & iPads', featured: true },
  { id: 'asus', name: 'ASUS', firstLetter: 'A', popularCategories: ['Laptops', 'Gaming Gear'], searchQuery: 'ASUS ROG ZenBook Vivobook laptop India', tagline: 'Innovative ZenBooks & ROG High-End Gaming Rigs', featured: true },
  { id: 'boat', name: 'boAt', firstLetter: 'B', popularCategories: ['Audio', 'Wearables'], searchQuery: 'boAt Airdopes headphones smartwatch India', tagline: "India's #1 Audio & Wearable Lifestyle Brand", featured: true },
  { id: 'bosch', name: 'Bosch', firstLetter: 'B', popularCategories: ['Appliances'], searchQuery: 'Bosch front load washing machine dishwasher India', tagline: 'German-engineered Home Washing Machines & Dishwashers' },
  { id: 'canon', name: 'Canon', firstLetter: 'C', popularCategories: ['Cameras', 'Printers'], searchQuery: 'Canon mirrorless camera ink tank printer India', tagline: 'Precision Optical Cameras & High-Yield Home Printers' },
  { id: 'casio', name: 'Casio', firstLetter: 'C', popularCategories: ['Watches', 'Musical Instruments'], searchQuery: 'Casio G-Shock Edifice digital keyboard India', tagline: 'Indestructible G-Shock Watches & Digital Synthesizers', featured: true },
  { id: 'croma', name: 'Croma', firstLetter: 'C', popularCategories: ['Appliances', 'Electronics'], searchQuery: 'Croma air conditioner microwave accessories India', tagline: 'Tata Enterprise Reliable Electronics & Home Tech', featured: true },
  { id: 'dell', name: 'Dell', firstLetter: 'D', popularCategories: ['Laptops', 'Office & Industrial'], searchQuery: 'Dell Inspiron XPS Alienware laptop India', tagline: 'Durable Inspiron Ultrabooks & XPS Displays' },
  { id: 'faber', name: 'Faber', firstLetter: 'F', popularCategories: ['Appliances'], searchQuery: 'Faber kitchen chimney auto clean India', tagline: 'European Kitchen Chimneys & Built-In Hobs' },
  { id: 'fastrack', name: 'Fastrack', firstLetter: 'F', popularCategories: ['Fashion', 'Watches'], searchQuery: 'Fastrack analog watch sunglasses smart band India', tagline: 'Youth Trendsetter Eyewear & Analog Watches' },
  { id: 'godrej', name: 'Godrej', firstLetter: 'G', popularCategories: ['Appliances', 'Furniture'], searchQuery: 'Godrej refrigerator edge washing machine India', tagline: 'Trusted Indian Household Appliances & Coolers' },
  { id: 'havells', name: 'Havells', firstLetter: 'H', popularCategories: ['Appliances', 'Beauty'], searchQuery: 'Havells air fryer beard trimmer ceiling fan India', tagline: 'Premium Electricals, Grooming Trimmers & Fryers' },
  { id: 'hp', name: 'HP', firstLetter: 'H', popularCategories: ['Laptops', 'Printers'], searchQuery: 'HP Pavilion Victus laptop Smart Tank printer India', tagline: 'Bestselling Pavilion Laptops & Smart Tank Printers', featured: true },
  { id: 'jbl', name: 'JBL', firstLetter: 'J', popularCategories: ['Audio'], searchQuery: 'JBL flip speaker wireless headphones India', tagline: 'Signature Bass Party Speakers & Earbuds', featured: true },
  { id: 'lenovo', name: 'Lenovo', firstLetter: 'L', popularCategories: ['Laptops', 'Tablets'], searchQuery: 'Lenovo IdeaPad Legion ThinkPad tablet India', tagline: 'ThinkPad Workstation Durability & Legion Gaming' },
  { id: 'lg', name: 'LG', firstLetter: 'L', popularCategories: ['Electronics', 'Appliances'], searchQuery: 'LG OLED 4k tv split inverter ac refrigerator India', tagline: 'Global OLED TV Pioneers & Direct Drive Inverter Tech', featured: true },
  { id: 'noise', name: 'Noise', firstLetter: 'N', popularCategories: ['Wearables', 'Audio'], searchQuery: 'Noise ColorFit smartwatch wireless earbuds India', tagline: "India's Leading Smartwatch & Bluetooth Calling Pioneer", featured: true },
  { id: 'oneplus', name: 'OnePlus', firstLetter: 'O', popularCategories: ['Smartphones', 'Audio', 'Tablets'], searchQuery: 'OnePlus 12 Nord CE4 wireless earbuds India', tagline: 'Fast & Smooth Flagships, Nord Series & Fast Charging', featured: true },
  { id: 'philips', name: 'Philips', firstLetter: 'P', popularCategories: ['Appliances', 'Beauty'], searchQuery: 'Philips digital air fryer beard trimmer hair dryer India', tagline: 'World-Renowned Air Fryers & Precision Grooming Tech', featured: true },
  { id: 'puma', name: 'Puma', firstLetter: 'P', popularCategories: ['Fashion', 'Sports'], searchQuery: 'Puma nitro running shoes sneakers track pants India', tagline: 'Speed Performance Sneakers & Lifestyle Athleisure' },
  { id: 'realme', name: 'Realme', firstLetter: 'R', popularCategories: ['Smartphones', 'Audio'], searchQuery: 'Realme 12 pro 5g buds air wireless India', tagline: 'Youth Trendsetting Design & Flagship 5G Cameras' },
  { id: 'samsung', name: 'Samsung', firstLetter: 'S', popularCategories: ['Smartphones', 'Electronics', 'Appliances', 'Tablets'], searchQuery: 'Samsung Galaxy S24 OLED TV refrigerator tablet India', tagline: 'Galaxy AI Flagships, Crystal UHD TVs & Dual Inverter Fridges', featured: true },
  { id: 'sony', name: 'Sony', firstLetter: 'S', popularCategories: ['Audio', 'Electronics', 'Gaming', 'Cameras'], searchQuery: 'Sony WH-1000XM5 Bravia 4K TV PS5 mirrorless India', tagline: 'Industry-Leading ANC Audio, Bravia 4K OLED & PlayStation 5', featured: true },
  { id: 'titan', name: 'Titan', firstLetter: 'T', popularCategories: ['Fashion', 'Watches'], searchQuery: 'Titan analog chronograph watch smart watch India', tagline: 'Iconic Indian Horology, Edge & Raga Collections', featured: true },
  { id: 'voltas', name: 'Voltas', firstLetter: 'V', popularCategories: ['Appliances'], searchQuery: 'Voltas 1.5 ton 5 star inverter split AC India', tagline: 'Tata Product #1 Air Conditioning Leader in India' },
  { id: 'whirlpool', name: 'Whirlpool', firstLetter: 'W', popularCategories: ['Appliances'], searchQuery: 'Whirlpool protton refrigerator washing machine India', tagline: '6th Sense Technology Refrigerators & Washing Machines' },
  { id: 'xiaomi', name: 'Xiaomi', firstLetter: 'X', popularCategories: ['Smartphones', 'Smart TVs', 'Electronics'], searchQuery: 'Xiaomi 14 Redmi note smart tv power bank India', tagline: 'Feature-Packed Redmi Note Series & 4K Smart TVs', featured: true },
  { id: 'zebronics', name: 'Zebronics', firstLetter: 'Z', popularCategories: ['Audio', 'Accessories'], searchQuery: 'Zebronics soundbar dolby atmos bluetooth speaker India', tagline: 'Affordable Dolby Soundbars & Multimedia Audio Tech' },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES_TREE.find(c => c.id === id || c.slug === id);
}

export function getSubcategoryById(catId: string, subId: string): SubCategory | undefined {
  const cat = getCategoryById(catId);
  if (!cat) return undefined;
  return cat.subcategories.find(s => s.id === subId || s.slug === subId);
}

export function searchCategoryTree(query: string): Array<{ category: Category; matchedSubcategories: SubCategory[] }> {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: Array<{ category: Category; matchedSubcategories: SubCategory[] }> = [];

  for (const cat of CATEGORIES_TREE) {
    const catMatches = cat.name.toLowerCase().includes(q) || cat.tagline.toLowerCase().includes(q);
    const matchedSubs = cat.subcategories.filter(
      s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.popularBrands.some(b => b.toLowerCase().includes(q))
    );

    if (catMatches || matchedSubs.length > 0) {
      results.push({
        category: cat,
        matchedSubcategories: matchedSubs.length > 0 ? matchedSubs : cat.subcategories,
      });
    }
  }

  return results;
}
