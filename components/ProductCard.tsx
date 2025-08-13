'use client'

import { useCart } from '@/lib/cart/CartContext'
import { cn } from '@/lib/utils'

export type Product = {
  id: string
  name: string
  price?: number
  imageUrl?: string
  businessId: string
  businessName: string
}

export default function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart()

  const add = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      businessId: product.businessId,
      businessName: product.businessName,
    })
  }

  return (
    <div className={cn('bg-white border rounded-lg p-4 flex flex-col', className)}>
      <div className="flex items-center gap-3">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-14 w-14 rounded object-cover border" />
        ) : (
          <div className="h-14 w-14 rounded bg-gray-100 flex items-center justify-center">🛍️</div>
        )}
        <div className="min-w-0">
          <div className="text-gray-900 font-medium truncate">{product.name}</div>
          {typeof product.price === 'number' && (
            <div className="text-sm text-gray-700">₹{product.price.toFixed(2)}</div>
          )}
          <div className="text-xs text-gray-500 truncate">{product.businessName}</div>
        </div>
      </div>
      <div className="mt-4">
        <button onClick={add} className="w-full px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  )
}


