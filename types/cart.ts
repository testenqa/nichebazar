export type CartItem = {
  id: string
  productId: string
  name: string
  quantity: number
  price?: number
  imageUrl?: string
  businessId: string
  businessName: string
}

export type CartState = {
  items: CartItem[]
}


