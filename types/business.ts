export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  tags: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface BusinessCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}
