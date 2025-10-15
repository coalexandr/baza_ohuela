export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  reviews?: {
    rating: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  image?: string;
  subcategories?: Category[];
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
}
