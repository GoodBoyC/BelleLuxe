import { Product } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// PRICING KEY  (all giveaway prices = 10% of retail MSRP)
//
// CeraVe Moisturizing Cream:
//   1.89 oz  → retail $4.00    → giveaway $0.40
//   8 oz     → retail $13.52   → giveaway $1.35
//   16 oz    → retail $15.97   → giveaway $1.60
//   19 oz    → retail $19.89   → giveaway $1.99
//
// La Roche-Posay Toleriane Double Repair:
//   40 ml (Travel/Mini)        → retail $11.49  → giveaway $1.15
//   100 ml (Full Size)         → retail $24.99  → giveaway $2.50
//   100 ml UV SPF 30           → retail $25.99  → giveaway $2.60
//   100 ml Matte (Oily)        → retail $24.97  → giveaway $2.50
//
// Fenty Beauty Pro Filt'r Soft Matte Foundation:
//   Mini (12 ml)               → retail $18.00  → giveaway $1.80
//   Standard (32 ml)           → retail $40.00  → giveaway $4.00
//
// Bone Straight Virgin Lace Front Wig (13x6 HD Swiss Lace):
//   16"                        → retail $189    → giveaway $18.90
//   18"                        → retail $219    → giveaway $21.90
//   20"                        → retail $249    → giveaway $24.90
//   22"                        → retail $279    → giveaway $27.90
//   24"                        → retail $319    → giveaway $31.90
//   26"                        → retail $369    → giveaway $36.90
//   28"                        → retail $429    → giveaway $42.90
//   30"                        → retail $499    → giveaway $49.90
// ─────────────────────────────────────────────────────────────────────────────

export const STORAGE_PRICE_MAP: Record<string, Record<string, number>> = {
  'cerave-moisturizing-cream': {
    '1.89 oz (Travel)': 0.40,
    '8 oz (Daily)': 1.35,
    '16 oz (Family)': 1.60,
    '19 oz (Value Tub)': 1.99,
  },
  'la-roche-posay-toleriane': {
    '40 ml — Mini Travel': 11.49,
    '100 ml — Full Size Original': 24.99,
    '100 ml — Full Size UV SPF 30': 25.99,
    '100 ml — Full Size Matte (Oily Skin)': 24.97,
  },
  'fenty-beauty-pro-filtr': {
    'Mini 12 ml / 0.4 fl oz': 1.80,
    'Standard 32 ml / 1.08 fl oz': 4.00,
  },
  'empress-bone-straight-wig': {
    '16 inches': 189,
    '18 inches': 219,
    '20 inches': 249,
    '22 inches': 279,
    '24 inches': 319,
    '26 inches': 369,
    '28 inches': 429,
    '30 inches': 499,
  },
};

export const STORAGE_ORIGINAL_PRICE_MAP: Record<string, Record<string, number>> = {
  'cerave-moisturizing-cream': {
    '1.89 oz (Travel)': 4.00,
    '8 oz (Daily)': 13.52,
    '16 oz (Family)': 15.97,
    '19 oz (Value Tub)': 19.89,
  },
  'la-roche-posay-toleriane': {
    '40 ml — Mini Travel': 11.49,
    '100 ml — Full Size Original': 24.99,
    '100 ml — Full Size UV SPF 30': 25.99,
    '100 ml — Full Size Matte (Oily Skin)': 24.97,
  },
  'fenty-beauty-pro-filtr': {
    'Mini 12 ml / 0.4 fl oz': 18.00,
    'Standard 32 ml / 1.08 fl oz': 40.00,
  },
  'empress-bone-straight-wig': {
    '16 inches': 189,
    '18 inches': 219,
    '20 inches': 249,
    '22 inches': 279,
    '24 inches': 319,
    '26 inches': 369,
    '28 inches': 429,
    '30 inches': 499,
  },
};

export const products: Product[] = [
  // ─── 1. CERAVE ───────────────────────────────────────────────────────────────
  {
    id: 'cerave-moisturizing-cream',
    name: 'CeraVe Moisturizing Cream',
    category: 'Skincare',
    tagline: '#1 Dermatologist Recommended Moisturizer in the USA',
    originalPrice: 15.97,
    discountPrice: 1.60,
    discountPercent: 90,
    badge: '#1 Best Seller',
    images: [
      {
        src: 'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-Face-Body-Moisturizer-for-Normal-to-Very-Dry-Skin-16-oz_63f2b83a-7915-4e2c-9d44-2840e1389e91.46fb38549baa1978bf189a170752c184.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'CeraVe Moisturizing Cream 16 oz Jar — Front',
      },
      {
        src: 'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-with-Pump-Face-Moisturizer-Body-Lotion-Normal-to-Very-Dry-Skin-16-oz_27d5d143-517a-479c-b9c5-681f63adb8ae.4985e2a86a6849e29c847634105f53c2.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'CeraVe Moisturizing Cream 16 oz with Pump',
      },
      {
        src: 'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-Travel-Size-Face-Moisturizer-Body-Lotion-Normal-to-Very-Dry-Skin-1-89-oz_f1d8f6ef-2f01-4cec-aeb1-977de1f83727.165517806a4e40d35d1ebdfa99e19d43.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'CeraVe Moisturizing Cream 1.89 oz Travel Size',
      },
      {
        src: 'https://i5.walmartimages.com/seo/CeraVe-Moisturizing-Cream-Face-Moisturizer-Body-Lotion-for-Normal-to-Very-Dry-Skin-8-oz_f6afdf69-c926-4646-89b6-c0ccd6b031d2.20c67edad24f763621db6a8866aceeee.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'CeraVe Moisturizing Cream 8 oz',
      },
    ],
    description:
      `CeraVe Moisturizing Cream is the #1 dermatologist recommended moisturizer in the United States. Developed alongside dermatologists, it delivers 24-hour hydration while restoring and maintaining the skin's natural protective barrier.\n\nFormulated with three essential ceramides (NP, AP, EOP), hyaluronic acid, and niacinamide. The patented MVE® (MultiVesicular Emulsion) delivery technology continuously releases moisturizing ingredients throughout the day — morning, noon, and night.\n\nNon-greasy, fast-absorbing, and accepted by the National Eczema Association. Safe for the whole family including babies 3+ years. Oil-free, fragrance-free, paraben-free, and non-comedogenic.`,
    benefits: [
      '24-hour continuous hydration via MVE® technology',
      'Restores and strengthens the natural skin barrier',
      '3 essential ceramides (NP, AP, EOP) + hyaluronic acid',
      'Fragrance-free, non-comedogenic, hypoallergenic',
      'Accepted by the National Eczema Association',
      'Safe for face, body, and hands — all skin types',
    ],
    ingredientsOrDetails: [
      { label: 'Active Ingredients', value: 'Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid, Niacinamide' },
      { label: 'Technology', value: 'Patented MVE® Controlled-Release delivery' },
      { label: 'Skin Type', value: 'Normal to Dry / Very Dry — All Skin Types' },
      { label: 'Available Sizes', value: '1.89 oz · 8 oz · 16 oz · 19 oz' },
    ],
    options: [
      {
        name: 'Size',
        values: ['1.89 oz (Travel)', '8 oz (Daily)', '16 oz (Family)', '19 oz (Value Tub)'],
      },
    ],
    rating: 4.8,
    reviews: 228491,
    inStock: true,
  },

  // ─── 2. LA ROCHE-POSAY ────────────────────────────────────────────────────────
  {
    id: 'la-roche-posay-toleriane',
    name: 'La Roche-Posay Toleriane Double Repair Moisturizer',
    category: 'Skincare',
    tagline: 'Clinically proven to restore skin barrier in just 1 hour',
    originalPrice: 24.99,
    discountPrice: 2.50,
    discountPercent: 90,
    badge: 'Dermatologist Pick',
    images: [
      {
        src: 'https://i5.walmartimages.com/seo/La-Roche-Posay-Toleriane-Double-Repair-Moisturizer-3-38-fl-oz_096c9c0f-20e6-4449-b722-2ba90d7b1c40.4123aeb28bd611162fda4c2e56be8bcf.png?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'La Roche-Posay Toleriane Double Repair Moisturizer 3.38 fl oz',
      },
      {
        src: 'https://i5.walmartimages.com/seo/La-Roche-Posay-Toleriane-Double-Repair-Matte-Face-Moisturizer-for-Oily-Skin-2-5-fl-oz_9f090b84-4668-4c16-acb5-3b9c552ca461.b0643c8411bf60ebaff6f425374fe3c2.png?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'La Roche-Posay Toleriane Double Repair Matte — Oily Skin',
      },
      {
        src: 'https://i5.walmartimages.com/seo/La-Roche-Posay-Toleriane-Double-Repair-Matte-Moisturizer-SPF-30-3-38-fl-oz_45a307ff-99e6-48e0-9e32-59dcde27fed6.c08811f7c9302c74e4dfa886e554d93d.png?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'La Roche-Posay Toleriane Double Repair Matte SPF 30',
      },
      {
        src: 'https://i5.walmartimages.com/seo/La-Roche-Posay-Lipikar-AP-Triple-Repair-Moisturizing-Cream-6-76-fl-oz_fa73be25-7c79-42aa-bf42-9686f7f3309e.5ee10cc0a4a1f0b7547910ff1613fc20.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'La Roche-Posay Lipikar AP+ Triple Repair Moisturizing Cream',
      },
    ],
    description:
      `La Roche-Posay Toleriane Double Repair Face Moisturizer is trusted by over 90,000 dermatologists worldwide across 60+ countries. It is the gold standard for sensitive skin care.\n\nIts dual-action formula provides up to 48-hour hydration while repairing the skin's natural protective barrier in as little as 1 hour. Formulated with La Roche-Posay Prebiotic Thermal Water, Ceramide-3, Niacinamide (Vitamin B3), and Glycerin.\n\nAvailable in four variants to match every skin need: Original for all skin types, UV SPF 30 for daily sun protection, Matte formula for oily and combination skin, and a Mini travel size.\n\nOil-free, fragrance-free, paraben-free, drying-alcohol-free, and non-comedogenic.`,
    benefits: [
      '48-hour clinically proven continuous hydration',
      'Restores the skin barrier within 1 hour of application',
      'Reduces visible redness — calms reactive and sensitive skin',
      'Lightweight texture — absorbs instantly, no residue',
      'Recommended by 90,000+ dermatologists across 60+ countries',
      'Safe for sensitive, reactive, eczema-prone, and post-procedure skin',
    ],
    ingredientsOrDetails: [
      { label: 'Active Ingredients', value: 'Ceramide-3, Niacinamide 5%, Glycerin, La Roche-Posay Prebiotic Thermal Water' },
      { label: 'Formula Type', value: 'Lightweight oil-free lotion — instant absorption' },
      { label: 'Skin Type', value: 'All Skin Types — Especially Sensitive & Dry' },
      { label: 'Variants', value: 'Original · UV SPF 30 · Matte (Oily) · Mini Travel' },
    ],
    options: [
      {
        name: 'Size & Formula',
        values: [
          '40 ml — Mini Travel',
          '100 ml — Full Size Original',
          '100 ml — Full Size UV SPF 30',
          '100 ml — Full Size Matte (Oily Skin)',
        ],
      },
    ],
    rating: 4.7,
    reviews: 74382,
    inStock: true,
  },

  // ─── 3. FENTY BEAUTY ─────────────────────────────────────────────────────────
  {
    id: 'fenty-beauty-pro-filtr',
    name: "Fenty Beauty Pro Filt'r Soft Matte Foundation",
    category: 'Cosmetics',
    tagline: "Rihanna's game-changing foundation — 50 inclusive shades for ALL women",
    originalPrice: 40.00,
    discountPrice: 4.00,
    discountPercent: 90,
    badge: 'Most Inclusive',
    images: [
      {
        src: 'https://cdn.shopify.com/s/files/1/0341/3458/9485/files/FB_FAL22_T2PRODUCT_CONCRETE_PRO_FILT_R_SOFT_MATTE_FOUNDATION_OPEN_335_1200x1500_FENTYVERSE.jpg?v=1762268835',
        alt: "Fenty Beauty Pro Filt'r Soft Matte Foundation open bottle shade #335",
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0341/3458/9485/files/FB760253_GLOBAL_COMPLEXION_INFOGRAPHIC_UPDATE_PRO-FILTR_1200x1500_B_A_MEDIUM_255_340_335.jpg?v=1732226380',
        alt: "Fenty Beauty Pro Filt'r — Before & After on Medium Skin Tones",
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0341/3458/9485/files/FB760253_GLOBAL_COMPLEXION_INFOGRAPHIC_UPDATE_PRO-FILTR-FOUNDATION_1200x1500_Shade-Grid_MEDIUM_379295d6-49e0-457c-a157-58e200eb4995.jpg?v=1732226307',
        alt: "Fenty Beauty Pro Filt'r — Medium Shade Range Grid",
      },
      {
        src: 'https://cdn.shopify.com/s/files/1/0341/3458/9485/products/FB_FALL22_T2PRODUCT_ARMSWATCH_SOFT_MATTE_FOUNDATION_1200x1500_8815adaa-1c25-46e6-9145-4de61486b7c8.jpg?v=1697755791',
        alt: "Fenty Beauty Pro Filt'r — Arm Swatches across All Skin Tones",
      },
    ],
    description:
      `Fenty Beauty Pro Filt'r Soft Matte Longwear Foundation — the foundation that changed the beauty industry. Rihanna launched it with 50 shades for ALL women when 40 shades was considered bold, and it immediately sold out globally.\n\nInducted into TIME Magazine's 2025 Best Inventions Hall of Fame as the only beauty product included. Winner of the 2019 Allure Reader's Choice Award. 9,600+ five-star reviews.\n\nFeatures Climate Adaptive Technology — flexes with your skin in every environment, absorbing oil instantly and resisting heat, sweat, and humidity morning through night. Buildable medium-to-full coverage with a soft-matte finish that diffuses pores and looks like skin — never cakey.\n\nAvailable in two sizes: Mini (12 ml) for travel or trying, and Standard (32 ml) for daily wear. 100% cruelty-free and vegan.`,
    benefits: [
      '50 boundary-breaking shades — fair to deep, every undertone',
      'Climate Adaptive Technology — fights heat, sweat, and humidity',
      'Buildable medium-to-full coverage with a filtered, pore-diffusing effect',
      'Soft-matte finish — feels weightless, undetectable on skin',
      'Longwear formula — stays fresh morning through night',
      '100% cruelty-free and vegan — inducted into TIME Magazine Hall of Fame',
    ],
    ingredientsOrDetails: [
      { label: 'Coverage', value: 'Buildable Medium → Full' },
      { label: 'Finish', value: 'Soft Matte — shine-free, natural skin effect' },
      { label: 'Shade Range', value: '50 shades — 5 families: Fair · Light · Medium · Tan · Deep' },
      { label: 'Available Sizes', value: 'Mini 12 ml ($18 retail) · Standard 32 ml ($40 retail)' },
    ],
    options: [
      {
        name: 'Shade Family',
        values: [
          'Fair / Porcelain (100–175)',
          'Light (185–230)',
          'Light Medium (235–310)',
          'Medium / Tan (315–395)',
          'Deep / Rich (400–498)',
        ],
      },
      {
        name: 'Size',
        values: ['Mini 12 ml / 0.4 fl oz', 'Standard 32 ml / 1.08 fl oz'],
      },
    ],
    rating: 4.4,
    reviews: 9668,
    inStock: true,
  },

  // ─── 4. BONE STRAIGHT WIG ────────────────────────────────────────────────────
  {
    id: 'empress-bone-straight-wig',
    name: 'Empress 13×6 HD Bone Straight Lace Front Wig',
    category: 'Hair Wigs',
    tagline: '100% Virgin Human Hair · Pre-plucked · HD Swiss Lace · Glueless Install',
    originalPrice: 249,
    discountPrice: 24.90,
    discountPercent: 90,
    badge: 'Most Popular',
    images: [
      {
        src: 'https://i5.walmartimages.com/seo/360-Full-Lace-Frontal-Wig-Brazilian-Bone-Straight-13x4-Transparent-Lace-Front-Human-Hair-Wigs-For-Black-Women-Pre-Plucked-Bling_56d5d161-019b-4f41-907b-fe8e9c96c408.e82090b2de9b37b47b9644aee9f5c592.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'Bone Straight Lace Front Wig — Brazilian 360 HD Transparent Lace — Pre-Plucked',
      },
      {
        src: 'https://i5.walmartimages.com/seo/DAPRZIY-34-Inch-Bone-Straight-13x4-Lace-Front-Human-Hair-Wigs-For-Women-Brazilian-360_87ee129d-4ca4-46a7-8643-147116e77363.75051b1c8ceda09d98b41970ed8cee06.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'Bone Straight 13×4 Lace Front Human Hair Wig — Long Length',
      },
      {
        src: 'https://i5.walmartimages.com/seo/34-Inch-Bone-Straight-13x4-Lace-Front-Human-Hair-Wigs-For-Women-Brazilian-360-Transparent-Human-Hair-Lace-Frontal-Wig_8a47e2a0-2309-4bab-ae54-e8b4c6815416.59d3b8bc4c02b0bf063f4c6ebbf0989d.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: '34-Inch Bone Straight Transparent Lace Front Human Hair Wig',
      },
      {
        src: 'https://i5.walmartimages.com/seo/360-Full-Lace-Frontal-Wig-Brazilian-Bone-Straight-13x4-Transparent-Lace-Front-Human-Hair-Wigs-For-Black-Women-Pre-Plucked-Bling_859d7d71-3d21-466a-9870-9958f15086f4.37bb86c63dad357718d6bec2021a54d5.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF',
        alt: 'Bone Straight 360 Full Lace Frontal Wig — Full Install View',
      },
    ],
    description:
      `The Empress 13×6 HD Bone Straight Lace Front Wig is the pinnacle of luxury human hair — sourced from a single pristine donor to ensure every cuticle aligns perfectly for zero tangling and a mirror-like silky shine that lasts.\n\nBone Straight is different from natural straight — it stays pin-straight without heat after washing, saving you time every single day. The 13×6 deep part HD Swiss lace melts invisibly into any skin tone, creating a completely undetectable scalp illusion.\n\nAvailable in 8 lengths from 16" to 30". Each length is priced differently to reflect the greater volume of hair. Pre-plucked baby hairline and pre-bleached knots mean zero prep work — glueless, install-and-go.\n\nHeat-friendly up to 450°F. Dyeable and bleachable. Built to last 2–5+ years with proper care.`,
    benefits: [
      '100% Raw Virgin Single-Donor Bone Straight Human Hair',
      '13×6 deep part HD Swiss transparent lace — invisible on all skin tones',
      'Stays silky straight after washing — no daily heat styling needed',
      'Pre-plucked natural baby hairline + pre-bleached invisible knots',
      '200% voluminous density — full, thick, and bouncy',
      'Glueless install with adjustable cap + 4 secure combs — beginner friendly',
    ],
    ingredientsOrDetails: [
      { label: 'Hair Grade', value: '10A Raw Virgin Single-Donor Brazilian Hair' },
      { label: 'Lace Type', value: '13×6 HD Swiss Transparent Lace — deep free-part' },
      { label: 'Density', value: '200% Double-Drawn Premium Density' },
      { label: 'Cap Size', value: 'Medium (22–22.5") adjustable + 4 combs' },
    ],
    options: [
      {
        name: 'Length',
        values: [
          '16 inches',
          '18 inches',
          '20 inches',
          '22 inches',
          '24 inches',
          '26 inches',
          '28 inches',
          '30 inches',
        ],
      },
    ],
    rating: 4.97,
    reviews: 3841,
    inStock: true,
  },
];
