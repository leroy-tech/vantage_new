import { StoreLink, getStoreLinks } from './storeLinks';

export interface DetailedProductInfo {
  id: string;
  name: string;
  canonicalName: string;
  category: string;
  tagline: string;
  price: string;
  mrp: string;
  savings: string;
  discountPercentage: number;
  rating: number;
  reviewsCount: string;
  store: string;
  sourceUrl: string;
  sourceStore: string;
  sourceBadge: string;
  imageUrl: string;
  gallery: string[];
  highlights: string[];
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  communityTake: string;
  expertTake: string;
  storeLinks: StoreLink[];
}

export const DETAILED_PRODUCTS_CATALOG: Record<string, DetailedProductInfo> = {
  'sony wh-1000xm5': {
    id: 'sony-xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    canonicalName: 'Sony WH-1000XM5 Wireless Industry-Leading ANC Headphones (Silver/Black)',
    category: 'audio',
    tagline: 'Flagship ANC Leader with 8-Mic Dual Processors',
    price: '₹28,990',
    mrp: '₹34,990',
    savings: 'Save ₹6,000 (17% off)',
    discountPercentage: 17,
    rating: 4.7,
    reviewsCount: '16,420+ verified Indian buyers',
    store: 'Flipkart Direct',
    sourceStore: 'Flipkart',
    sourceUrl: 'https://www.flipkart.com/sony-wh-1000xm5-wireless-industry-leading-active-noise-cancelling-headphones-mic-bluetooth-wired/p/itmb7d860129eb21',
    sourceBadge: 'Official Product Listing · Flipkart',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80'
    ],
    highlights: [
      'Industry-leading Active Noise Cancellation with 2 processors & 8 microphones',
      'Up to 30-hour battery life with quick charge (3 min gives 3 hours)',
      'Ultra-comfortable, lightweight design with soft fit leather',
      'Crystal clear hands-free calling with 4 beamforming mics and AI noise reduction',
      'Multipoint connection: pair with 2 Bluetooth devices seamlessly'
    ],
    specs: {
      'Driver Unit': '30mm, Carbon Fiber Composite Dome',
      'Battery Life': '30 Hours (ANC On) / 40 Hours (ANC Off)',
      'Fast Charging': '3 mins = 3 hours playback via USB-PD',
      'Bluetooth Version': '5.2 (LDAC, AAC, SBC supported)',
      'Noise Cancelling': 'Dual Processor (QN1 + V1) with Auto NC Optimizer',
      'Weight': '250 grams (Ultra lightweight)',
      'Warranty': '1 Year Official Sony India Warranty',
      'Voice Assistant': 'Google Assistant, Alexa, Siri Built-in'
    },
    pros: [
      'Unrivaled ANC performance for commutes, flights, and office focus',
      'Class-leading high-resolution LDAC audio fidelity',
      'Exceptionally plush and lightweight earcups for all-day wear',
      'Top-tier voice call clarity in noisy Indian traffic environments'
    ],
    cons: [
      'Earcups fold flat into case but do not collapse inward like the XM4',
      'No IP water resistance rating (not designed for intense rainy workouts)'
    ],
    communityTake: 'Indian tech communities (Reddit r/headphones, r/indiangaming) rate XM5 as the gold standard for active noise cancellation. Frequently praised for making metro rides and Mumbai/Bangalore traffic dead silent.',
    expertTake: 'Gadgets360 and TechRadar rate it 4.5/5. The dual processor architecture establishes a new benchmark for high-frequency human voice suppression.',
    storeLinks: [
      {
        store: 'Flipkart',
        name: 'Flipkart (Verified Listing)',
        url: 'https://www.flipkart.com/sony-wh-1000xm5-wireless-industry-leading-active-noise-cancelling-headphones-mic-bluetooth-wired/p/itmb7d860129eb21',
        badge: 'Direct Product',
        color: '#2874F0'
      },
      {
        store: 'Amazon India',
        name: 'Amazon.in (Sony Store)',
        url: 'https://www.amazon.in/Sony-WH-1000XM5-Wireless-Cancelling-Headphones/dp/B09XS7JWHH',
        badge: 'Prime Deal',
        color: '#FF9900'
      },
      {
        store: 'Croma',
        name: 'Croma Retail',
        url: 'https://www.croma.com/searchB?q=Sony+WH-1000XM5',
        badge: 'Store Pickup',
        color: '#00E8C6'
      },
      {
        store: 'Reliance Digital',
        name: 'Reliance Digital',
        url: 'https://www.reliancedigital.in/search?q=Sony+WH-1000XM5',
        badge: 'Offers in ₹',
        color: '#E42529'
      }
    ]
  },

  'apple macbook air m3': {
    id: 'macbook-air',
    name: 'Apple MacBook Air 13-inch M3 (16GB/512GB)',
    canonicalName: 'Apple MacBook Air (13.6-inch Liquid Retina, M3 Chip, 16GB Unified RAM, 512GB SSD, Midnight)',
    category: 'laptops',
    tagline: 'Lean. Mean. M3 Machine. 18-Hour Battery Life.',
    price: '₹1,14,990',
    mrp: '₹1,34,900',
    savings: 'Save ₹19,910 with HDFC & Instant Discount',
    discountPercentage: 15,
    rating: 4.8,
    reviewsCount: '8,940+ verified Indian buyers',
    store: 'Amazon India Direct',
    sourceStore: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/Apple-MacBook-13-inch-Unified-Storage/dp/B0CX21C8S7',
    sourceBadge: 'Official Product Listing · Apple India Store',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80'
    ],
    highlights: [
      'Blazing Apple M3 silicon with 8-core CPU and 10-core GPU',
      'Up to 18 hours of real battery life on a single charge',
      '13.6-inch Liquid Retina display with 500 nits brightness and True Tone',
      'Dual external display support with laptop lid closed',
      'Fanless, completely silent aluminum unibody enclosure'
    ],
    specs: {
      'Processor': 'Apple M3 chip (8-core CPU, 10-core GPU, 16-core Neural Engine)',
      'Memory': '16GB Unified Memory (High bandwidth)',
      'Storage': '512GB NVMe SSD Fast Storage',
      'Display': '13.6-inch Liquid Retina Display (2560 x 1664 at 224 ppi, 500 nits)',
      'Battery': 'Up to 18 hours Apple TV playback / 15 hours wireless web',
      'Weight': '1.24 kg (Ultra portable)',
      'Ports': 'MagSafe 3, 2x Thunderbolt 4 / USB-C, 3.5mm Headphone Jack',
      'Warranty': '1 Year Apple India Official Limited Warranty'
    },
    pros: [
      'Phenomenal battery life that easily lasts 2 full working days',
      'Zero fan noise under any workload with cool thermals',
      'Vibrant Liquid Retina screen with crisp text rendering',
      'Premium MagSafe fast-charging and industry-best trackpad'
    ],
    cons: [
      'Base model starts at 256GB, 16GB/512GB configuration recommended for developers',
      'External dual monitors require the laptop lid to be kept closed'
    ],
    communityTake: 'r/developersIndia and Indian software engineers unanimously praise the M3 16GB for effortless Docker, Xcode, and full-stack development without ever needing a charger at cafes.',
    expertTake: 'TechRadar India & NDTV give it 9.3/10: "The undisputed champion of everyday premium notebooks for students, writers, and developers."',
    storeLinks: [
      {
        store: 'Amazon India',
        name: 'Amazon.in (Apple Store)',
        url: 'https://www.amazon.in/Apple-MacBook-13-inch-Unified-Storage/dp/B0CX21C8S7',
        badge: 'Prime Deal',
        color: '#FF9900'
      },
      {
        store: 'Flipkart',
        name: 'Flipkart Listing',
        url: 'https://www.flipkart.com/apple-macbook-air-apple-m3-16-gb-512-gb-ssd-macos-sonoma-mxd13hn-a/p/itm5a4ecb3c0c0b8',
        badge: 'Offers in ₹',
        color: '#2874F0'
      },
      {
        store: 'Croma',
        name: 'Croma Apple Authorised',
        url: 'https://www.croma.com/searchB?q=Apple+MacBook+Air+M3',
        badge: 'Store Pickup',
        color: '#00E8C6'
      },
      {
        store: 'Reliance Digital',
        name: 'Reliance Digital',
        url: 'https://www.reliancedigital.in/search?q=MacBook+Air+M3',
        badge: 'Compare',
        color: '#E42529'
      }
    ]
  },

  'samsung galaxy s24 ultra': {
    id: 's24-ultra',
    name: 'Samsung Galaxy S24 Ultra 5G AI',
    canonicalName: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB RAM, 256GB Storage, S-Pen)',
    category: 'phones',
    tagline: '200MP Quad Camera + Galaxy AI & Titanium Armor',
    price: '₹1,19,999',
    mrp: '₹1,34,999',
    savings: 'Save ₹15,000 + Exchange Bonus',
    discountPercentage: 11,
    rating: 4.8,
    reviewsCount: '21,300+ reviews',
    store: 'Amazon India Direct',
    sourceStore: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/Samsung-Galaxy-Ultra-Titanium-Storage/dp/B0CS5X682H',
    sourceBadge: 'Official Product Listing · Amazon',
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80'
    ],
    highlights: [
      'Titanium Frame with Corning Gorilla Armor Anti-Reflective Glass',
      'Circle to Search with Google, Live Translate & Note Assist Galaxy AI',
      '200MP Main Camera with 5x 50MP Periscope Optical Zoom',
      'Snapdragon 8 Gen 3 for Galaxy processor with Ray Tracing',
      '7 Years of Android OS and Security Upgrades guaranteed'
    ],
    specs: {
      'Processor': 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)',
      'RAM / Storage': '12GB LPDDR5X / 256GB UFS 4.0',
      'Display': '6.8-inch Dynamic AMOLED 2X, 120Hz LTPO, 2600 nits peak',
      'Rear Cameras': '200MP (OIS) + 50MP (5x Periscope) + 10MP (3x Telephoto) + 12MP (Ultra-wide)',
      'Battery': '5000 mAh with 45W Fast Charging and 15W Wireless Charging',
      'Durability': 'Titanium Frame, IP68 Dust/Water Resistant, S-Pen included',
      'Software': 'One UI 6.1 with 7 years of Android OS updates'
    },
    pros: [
      'Anti-reflective Gorilla Armor glass is transformative in harsh Indian sunlight',
      'Unsurpassed 200MP zoom and nighttime video recording',
      'Built-in S-Pen for sketching, signatures, and precision editing',
      'Industry-leading 7 years of guaranteed Android software updates'
    ],
    cons: [
      '45W charger not included in the retail box (sold separately)',
      'Substantial weight and squared titanium corners'
    ],
    communityTake: 'Indian users rave about the outdoor screen visibility on sunny days and the battery easily crossing 8 hours of screen-on-time.',
    expertTake: 'Beebom & Gadgets360 award 9.4/10: "The definitive Android superphone with the best anti-glare display ever engineered."',
    storeLinks: [
      {
        store: 'Amazon India',
        name: 'Amazon.in (Samsung Store)',
        url: 'https://www.amazon.in/Samsung-Galaxy-Ultra-Titanium-Storage/dp/B0CS5X682H',
        badge: 'Direct Listing',
        color: '#FF9900'
      },
      {
        store: 'Flipkart',
        name: 'Flipkart Listing',
        url: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itm87bc7dbeffea5',
        badge: 'Offers in ₹',
        color: '#2874F0'
      },
      {
        store: 'Croma',
        name: 'Croma Retail',
        url: 'https://www.croma.com/searchB?q=Samsung+Galaxy+S24+Ultra',
        badge: 'Store Pickup',
        color: '#00E8C6'
      }
    ]
  },

  'philips digital air fryer': {
    id: 'air-fryer',
    name: 'Philips Digital Air Fryer HD9252 (4.1L)',
    canonicalName: 'Philips Digital Air Fryer HD9252/90 with Rapid Air Technology (Touch Panel, 4.1L)',
    category: 'appliances',
    tagline: '90% Less Oil Cooking with Rapid Air Technology',
    price: '₹6,499',
    mrp: '₹10,995',
    savings: 'Save ₹4,496 (41% off)',
    discountPercentage: 41,
    rating: 4.6,
    reviewsCount: '34,800+ Indian kitchen ratings',
    store: 'Amazon India Direct',
    sourceStore: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/Philips-Technology-NutriU-App-Recipes-Fryer-HD9252/dp/B097RJ867P',
    sourceBadge: 'Official Product Listing · Philips India',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80'
    ],
    highlights: [
      'Rapid Air Technology with unique Starfish design for even cooking without flipping',
      'Cooks with up to 90% less oil for healthy samosas, fries, and tikkas',
      '7 Preset digital cooking modes on capacitive touch panel',
      'Dishwasher-safe non-stick QuickClean basket',
      'NutriU App with 500+ Indian snack and meal recipes'
    ],
    specs: {
      'Capacity': '4.1 Liters (Ideal for 3-4 person family)',
      'Power Consumption': '1400 Watts',
      'Temperature Control': 'Up to 200°C with digital timer',
      'Basket Material': 'Non-stick dishwasher safe QuickClean coating',
      'Presets': 'Frozen snacks, fresh fries, meat, fish, chicken drumsticks, cake, grilled veggies',
      'Warranty': '2 Years Official Philips India Worldwide Guarantee'
    },
    pros: [
      'Consistently crispy samosas, pakoras, and french fries using minimal oil',
      'Digital touch screen with intuitive Indian snack presets',
      'Compact footprint fits easily on modern Indian kitchen counters',
      'Removable basket is effortless to wash under running water'
    ],
    cons: [
      'Capacity is 4.1L; for joint families of 6+ people, the Philips XXL model is preferable'
    ],
    communityTake: 'Beloved on Indian food Reddit and YouTube. Widely hailed for crisping frozen snacks and making guilt-free paneer tikka and chicken tandoori in 15 minutes.',
    expertTake: 'Top pick by NDTV Food and Tech Consumer Reports for temperature consistency and build quality.',
    storeLinks: [
      {
        store: 'Amazon India',
        name: 'Amazon.in (Philips Direct)',
        url: 'https://www.amazon.in/Philips-Technology-NutriU-App-Recipes-Fryer-HD9252/dp/B097RJ867P',
        badge: 'Prime Deal',
        color: '#FF9900'
      },
      {
        store: 'Flipkart',
        name: 'Flipkart Listing',
        url: 'https://www.flipkart.com/philips-hd9252-90-rapid-air-technology-digital-display-touch-panel-4-1-l-air-fryer/p/itm67d934bb61b17',
        badge: 'Check Deals',
        color: '#2874F0'
      },
      {
        store: 'Croma',
        name: 'Croma Appliances',
        url: 'https://www.croma.com/searchB?q=Philips+HD9252+Air+Fryer',
        badge: 'Store Pickup',
        color: '#00E8C6'
      }
    ]
  },

  'samsung galaxy watch 6': {
    id: 'galaxy-watch',
    name: 'Samsung Galaxy Watch 6 LTE (44mm)',
    canonicalName: 'Samsung Galaxy Watch 6 LTE (Graphite, 44mm, Sapphire Crystal, Blood Pressure & ECG)',
    category: 'wearables',
    tagline: 'Sapphire Crystal Glass + BioActive Sensor & Sleep Coaching',
    price: '₹21,999',
    mrp: '₹33,999',
    savings: 'Save ₹12,000 (35% off)',
    discountPercentage: 35,
    rating: 4.6,
    reviewsCount: '9,200+ Indian smartwatch reviews',
    store: 'Amazon India Direct',
    sourceStore: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/Samsung-Galaxy-Bluetooth-Graphite-Compatible/dp/B0CC95BHYK',
    sourceBadge: 'Official Product Listing · Samsung India',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ],
    highlights: [
      'Super AMOLED 1.5-inch display with 20% larger screen and slimmer bezels',
      'Sapphire Crystal glass protection against scratches and drops',
      '3-in-1 BioActive sensor: ECG, Optical Heart Rate, and Body Composition Analysis (BIA)',
      'Standalone 4G LTE calling without carrying your smartphone',
      'Advanced sleep coaching with snoring detection'
    ],
    specs: {
      'Display': '1.5-inch Super AMOLED (480x480), Always-on Display, Sapphire Crystal',
      'Connectivity': '4G LTE (eSIM), Wi-Fi, Bluetooth 5.3, NFC Samsung Pay, GPS',
      'Health Sensors': 'Optical Heart Rate, Electrical Heart (ECG), Bioelectrical Impedance (BIA), Temperature Sensor',
      'Water Resistance': '5ATM + IP68 / MIL-STD-810H Military Standard',
      'Battery': '425 mAh with Fast Wireless Magnetic Charging',
      'Operating System': 'Wear OS Powered by Samsung (One UI Watch 5)'
    },
    pros: [
      'Flawless integration with Indian banking NFC tap-and-pay via Samsung Wallet',
      'Accurate health and ECG tracking certified for consumer wellness',
      'Clear, scratch-resistant sapphire crystal glass face',
      'Fluid Wear OS animations with Google Play Store app access'
    ],
    cons: [
      'Battery lasts approximately 30-36 hours, requires daily or alternate-day charging'
    ],
    communityTake: 'Considered the premier Android smartwatch in India. Indian buyers love answering phone calls on wrist over LTE during morning runs without taking their phone along.',
    expertTake: 'Rated 4.6/5 by TechRadar and Beebom for the best display-to-body ratio in any Wear OS smartwatch.',
    storeLinks: [
      {
        store: 'Amazon India',
        name: 'Amazon.in (Samsung Store)',
        url: 'https://www.amazon.in/Samsung-Galaxy-Bluetooth-Graphite-Compatible/dp/B0CC95BHYK',
        badge: 'Prime Deal',
        color: '#FF9900'
      },
      {
        store: 'Flipkart',
        name: 'Flipkart Listing',
        url: 'https://www.flipkart.com/samsung-galaxy-watch6-lte-smartwatch/p/itm6e97c9c0b16a2',
        badge: 'Check Offers',
        color: '#2874F0'
      }
    ]
  },

  'sony bravia 55': {
    id: 'sony-oled',
    name: 'Sony Bravia 55" 4K Google TV (KD-55X74L)',
    canonicalName: 'Sony Bravia 138.8 cm (55 inches) 4K Ultra HD Smart LED Google TV KD-55X74L',
    category: 'appliances',
    tagline: 'Dolby Audio + X1 4K Processor & Live Color Technology',
    price: '₹57,990',
    mrp: '₹99,900',
    savings: 'Save ₹41,910 (42% off)',
    discountPercentage: 42,
    rating: 4.8,
    reviewsCount: '19,500+ Indian home ratings',
    store: 'Amazon India Direct',
    sourceStore: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/Sony-Bravia-inches-Google-KD-55X74L/dp/B0C15BLYS3',
    sourceBadge: 'Official Product Listing · Sony India',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1000&q=80'
    ],
    highlights: [
      '4K Processor X1 upscales standard content to near-4K resolution with lifelike colors',
      'Motionflow XR 100 delivers smooth, blur-free sports and action scenes',
      'Open Baffle Speaker with 20 Watts output and Dolby Audio',
      'Google TV with Chromecast built-in and Apple AirPlay support',
      'X-Protection PRO safeguards against lightning, surge, dust, and humidity'
    ],
    specs: {
      'Screen Size': '55 inches (138.8 cm diagonal)',
      'Resolution': '4K Ultra HD (3840 x 2160 pixels)',
      'Refresh Rate': '60 Hz with Motionflow XR 100',
      'Sound Output': '20 Watts, Dolby Audio, 2ch Open Baffle Speaker',
      'Smart TV OS': 'Google TV with Voice Search Remote',
      'Connectivity': '3x HDMI, 2x USB, Dual-band Wi-Fi, Bluetooth 5.0',
      'Warranty': '1 Year Comprehensive Sony India Warranty'
    },
    pros: [
      'Unsurpassed color tuning and natural skin tones compared to competitors',
      'X-Protection PRO ensures resilience against Indian monsoon humidity and power surges',
      'Google TV UI is snappy and natively streams Hotstar, Netflix, and Prime Video in 4K',
      'Dependable Sony India home installation and service'
    ],
    cons: [
      '60Hz refresh rate (sufficient for movies, but hard-core PS5 gamers might prefer the 120Hz X90L)'
    ],
    communityTake: 'Renowned across Indian living rooms for natural picture processing that doesn’t over-saturate Indian skin tones like cheaper LED panels.',
    expertTake: 'TechRadar and NDTV Gadgets 360 consistently rank Sony X74L as the best overall 55-inch brand TV under ₹60,000.',
    storeLinks: [
      {
        store: 'Amazon India',
        name: 'Amazon.in (Sony Store)',
        url: 'https://www.amazon.in/Sony-Bravia-inches-Google-KD-55X74L/dp/B0C15BLYS3',
        badge: 'Prime Deal',
        color: '#FF9900'
      },
      {
        store: 'Flipkart',
        name: 'Flipkart Listing',
        url: 'https://www.flipkart.com/sony-bravia-2-138-8-cm-55-inch-ultra-hd-4k-led-smart-google-tv-2024-kd-55s25b/p/itm53472ca62ae4a',
        badge: 'Direct Product',
        color: '#2874F0'
      },
      {
        store: 'Croma',
        name: 'Croma Electronics',
        url: 'https://www.croma.com/searchB?q=Sony+Bravia+55+inch',
        badge: 'Store Pickup',
        color: '#00E8C6'
      }
    ]
  },

  'sony alpha ilce-6100l': {
    id: 'sony-camera',
    name: 'Sony Alpha ILCE-6100L Mirrorless Camera',
    canonicalName: 'Sony Alpha ILCE-6100L 24.2 MP Mirrorless Camera with 16-50mm Power Zoom Lens (Black)',
    category: 'audio',
    tagline: 'Real-time Eye AF & 4K Recording for Creators',
    price: '₹61,490',
    mrp: '₹75,990',
    savings: 'Save ₹14,500 + Lens Kit included',
    discountPercentage: 19,
    rating: 4.7,
    reviewsCount: '6,100+ creator reviews',
    store: 'Amazon India Direct',
    sourceStore: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/Sony-ILCE-6100L-Mirrorless-Smartphone-Connectivity/dp/B07ZHLG4C4',
    sourceBadge: 'Official Product Listing · Sony Alpha India',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80'
    ],
    highlights: [
      '24.2 Megapixel Exmor CMOS sensor with BIONZ X image processor',
      '0.02-second autofocus with 425 phase-detection points',
      'Real-time Eye AF for Humans and Animals in photo & video',
      'Internal 4K movie recording with full pixel readout',
      '180-degree tiltable LCD touchscreen for effortless vlogging'
    ],
    specs: {
      'Sensor': '24.2 MP APS-C Exmor CMOS Sensor',
      'Autofocus': '425 Phase Detection & Contrast Detection AF Points',
      'Video': '4K UHD at 30p / Full HD at 120p slow motion',
      'Continuous Shooting': 'Up to 11 fps with AF/AE tracking',
      'Screen': '3.0-inch 180° Flip-Up Touchscreen LCD',
      'Weight': '396 grams (Body with battery and memory card)',
      'Lens Mount': 'Sony E-mount (Broadest lens ecosystem)'
    },
    pros: [
      'Class-leading autofocus locks onto eyes instantly without hunting',
      'Flip-up 180° screen makes YouTube, reels, and podcasting easy',
      'Compact, lightweight travel-friendly body'
    ],
    cons: [
      'No in-body image stabilization (relies on lens-based optical SteadyShot)'
    ],
    communityTake: 'The staple camera for Indian content creators and aspiring photographers stepping up from smartphones.',
    expertTake: 'DPReview & Gadgets360 rate it 8.8/10 for providing full Sony Alpha flagship autofocus at an accessible price point.',
    storeLinks: [
      {
        store: 'Amazon India',
        name: 'Amazon.in (Sony Official)',
        url: 'https://www.amazon.in/Sony-ILCE-6100L-Mirrorless-Smartphone-Connectivity/dp/B07ZHLG4C4',
        badge: 'Prime Deal',
        color: '#FF9900'
      },
      {
        store: 'Flipkart',
        name: 'Flipkart Listing',
        url: 'https://www.flipkart.com/sony-ilce-6100l-b-in5-mirrorless-camera-body-with-16-50-mm-power-zoom-lens/p/itmd06649725f190',
        badge: 'Camera Kit',
        color: '#2874F0'
      }
    ]
  },

  'keychron k2': {
    id: 'mech-keyboard',
    name: 'Keychron K2 V2 Wireless Mechanical Keyboard',
    canonicalName: 'Keychron K2 (Version 2) 75% Layout Wireless Mechanical Keyboard (Gateron Brown Switches, RGB Backlit)',
    category: 'laptops',
    tagline: 'Gateron Brown Switches + Wireless Bluetooth & Mac/Windows Layout',
    price: '₹7,999',
    mrp: '₹10,499',
    savings: 'Save ₹2,500 (24% off)',
    discountPercentage: 24,
    rating: 4.8,
    reviewsCount: '4,800+ Indian developer reviews',
    store: 'Amazon India Direct',
    sourceStore: 'Amazon India',
    sourceUrl: 'https://www.amazon.in/Keychron-Mechanical-Keyboard-Backlight-Wireless/dp/B087612TFL',
    sourceBadge: 'Official Product Listing · Keychron India',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80'
    ],
    highlights: [
      '75% compact 84-key layout retaining all essential function and arrow keys',
      'Connects up to 3 devices via Bluetooth 5.1 and switches effortlessly',
      'Gateron G Pro Mechanical Switches (Tactile, smooth actuation)',
      'Dedicated Mac layout with extra Windows keycaps included in the box',
      'Massive 4000 mAh rechargeable battery lasting up to 240 hours'
    ],
    specs: {
      'Layout': '75% (84 Keys)',
      'Switches': 'Gateron G Pro Brown (Tactile 55gf)',
      'Connectivity': 'Bluetooth 5.1 / Type-C Wired Cable',
      'Compatibility': 'macOS / Windows / iOS / Android',
      'Battery': '4000 mAh Lithium-polymer',
      'Backlight': '18 Types of RGB Backlight Animations',
      'Keycap Material': 'Double-shot ABS with extra Mac & Windows keys'
    },
    pros: [
      'Superb tactile feedback that transforms typing comfort for programmers and writers',
      'Flawless toggle between MacBook and Windows gaming desktop',
      'Giant 4000 mAh battery requires charging once every month without RGB'
    ],
    cons: [
      'Slightly tall front lip; using a desk wrist rest is recommended for long coding sessions'
    ],
    communityTake: 'The most recommended mechanical keyboard on r/developersIndia for anyone using a MacBook or home desk setup.',
    expertTake: 'TechRadar India rates it 4.5/5: "The reigning king of entry-level wireless mechanical keyboards."',
    storeLinks: [
      {
        store: 'Amazon India',
        name: 'Amazon.in (Keychron Store)',
        url: 'https://www.amazon.in/Keychron-Mechanical-Keyboard-Backlight-Wireless/dp/B087612TFL',
        badge: 'Prime Deal',
        color: '#FF9900'
      },
      {
        store: 'Flipkart',
        name: 'Flipkart Listing',
        url: 'https://www.flipkart.com/keychron-k2-version-2-bluetooth-mechanical-keyboard/p/itm4d5f19bfd081f',
        badge: 'Offers in ₹',
        color: '#2874F0'
      }
    ]
  }
};

/**
 * Find curated or generate fallback product details with intelligent alias matching
 */
export function getCuratedProductDetails(query: string): DetailedProductInfo | null {
  const q = query.toLowerCase().trim();

  // Direct key or ID match
  for (const [key, prod] of Object.entries(DETAILED_PRODUCTS_CATALOG)) {
    if (q.includes(key) || key.includes(q) || (prod.id && (q.includes(prod.id) || prod.id.includes(q)))) {
      return prod;
    }
  }

  // Common aliases & shortcuts
  if (q.includes('xm5') || q.includes('wh1000xm5') || (q.includes('sony') && (q.includes('headphone') || q.includes('noise')))) {
    return DETAILED_PRODUCTS_CATALOG['sony wh-1000xm5'];
  }
  if (q.includes('macbook') || q.includes('m3 air') || q.includes('macbook air') || q.includes('apple laptop')) {
    return DETAILED_PRODUCTS_CATALOG['apple macbook air m3'];
  }
  if (q.includes('s24') || q.includes('galaxy s24') || q.includes('s24 ultra') || q.includes('samsung ultra')) {
    return DETAILED_PRODUCTS_CATALOG['samsung galaxy s24 ultra'];
  }
  if (q.includes('air fryer') || q.includes('philips fryer') || q.includes('hd9252') || q.includes('fryer')) {
    return DETAILED_PRODUCTS_CATALOG['philips digital air fryer'];
  }
  if (q.includes('galaxy watch') || q.includes('watch 6') || q.includes('watch6') || (q.includes('samsung') && q.includes('watch'))) {
    return DETAILED_PRODUCTS_CATALOG['samsung galaxy watch 6'];
  }
  if (q.includes('bravia') || q.includes('sony tv') || q.includes('sony oled') || q.includes('kd-55') || (q.includes('sony') && q.includes('55'))) {
    return DETAILED_PRODUCTS_CATALOG['sony bravia 55'];
  }
  if (q.includes('alpha') || q.includes('ilce') || q.includes('6100') || (q.includes('sony') && q.includes('camera'))) {
    return DETAILED_PRODUCTS_CATALOG['sony alpha ilce-6100l'];
  }
  if (q.includes('keychron') || q.includes('mechanical keyboard') || q.includes('k2 v2') || q.includes('k2')) {
    return DETAILED_PRODUCTS_CATALOG['keychron k2'];
  }

  return null;
}
