'use client'

import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/client'
import { Product } from '@/types/product'

export default function MyBusinessesPage() {
  const [email, setEmail] = useState<string>('')
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    photo: '',
    dimensions: '',
    size: '',
    price: '',
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const { data } = await supabaseBrowser.auth.getUser()
      const userEmail = data.user?.email?.toLowerCase() || ''
      if (mounted) setEmail(userEmail)
      if (!userEmail) { setRows([]); setLoading(false); return }
      setLoading(true)
      try {
        const res = await fetch(`/api/businesses?onlyVerified=true&email=${encodeURIComponent(userEmail)}`, { cache: 'no-store' })
        const json = await res.json()
        setRows(Array.isArray(json?.data) ? json.data : [])
      } catch (_) {
        setRows([])
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleAddProduct = (businessId: string) => {
    setSelectedBusinessId(businessId)
    setShowAddModal(true)
  }

  const handleViewProducts = async (businessId: string) => {
    setSelectedBusinessId(businessId)
    setLoadingProducts(true)
    setShowViewModal(true)
    setProducts([]) // Clear existing products while loading
    
    try {
      const response = await fetch(`/api/products?businessId=${businessId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (response.ok) {
        const data = await response.json()
        setProducts(Array.isArray(data?.data) ? data.data : [])
      } else {
        alert('Failed to fetch products. Please try again.')
      }
    } catch (error) {
      alert('Error fetching products. Please try again.')
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBusinessId) return

    try {
      // Submit the product details to the backend
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productForm, businessId: selectedBusinessId }),
      })

      const result = await response.json()
      
      if (response.ok && result.product) {
        alert('Product added successfully!')
        setShowAddModal(false)
        setProductForm({ name: '', photo: '', dimensions: '', size: '', price: '' })
        // Refresh the products list if we're viewing products for this business
        if (showViewModal && selectedBusinessId) {
          handleViewProducts(selectedBusinessId)
        }
      } else {
        alert(result.error || 'Failed to add product. Please try again.')
      }
    } catch (error) {
      alert('Failed to add product. Please try again.')
    }
  }


  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Approved Businesses</h1>
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-600">No approved businesses found for {email || 'your account'}.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rows.map((b) => (
            <div key={b.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-4">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.name} className="h-16 w-16 rounded object-cover border" />
                ) : (
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center text-2xl">🏷️</div>
                )}
                <div>
                  <div className="text-lg font-semibold text-gray-900">{b.name}</div>
                  <div className="text-sm text-green-700">Approved</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{b.description || '-'}</div>
              <div className="mt-3 text-sm text-gray-700">{[b.address, b.city, b.state, b.zip_code].filter(Boolean).join(', ')}</div>
              <div className="mt-2 text-sm text-gray-700">Email: {b.email || '-'}</div>
              <div className="text-sm text-gray-700">Phone: {b.phone || '-'}</div>

              {/* Add Product Button */}
              <button
                onClick={() => handleAddProduct(b.id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Add Product
              </button>

              {/* View Products Button */}
              <button
                onClick={() => handleViewProducts(b.id)}
                className="mt-2 px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                View Products
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Adding Product */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                <input
                  type="text"
                  value={productForm.photo}
                  onChange={(e) => setProductForm({ ...productForm, photo: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Dimensions</label>
                <input
                  type="text"
                  value={productForm.dimensions}
                  onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <input
                  type="text"
                  value={productForm.size}
                  onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Viewing Products */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Products</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {loadingProducts ? (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading products...</div>
              </div>
            ) : products.length === 0 ? (
              <p className="text-gray-600">No products found for this business.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    {product.photo ? (
                      <img src={product.photo} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg mb-3">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-1">Price: ${product.price}</p>
                    {product.dimensions && (
                      <p className="text-gray-600 mb-1">Dimensions: {product.dimensions}</p>
                    )}
                    {product.size && (
                      <p className="text-gray-600 mb-1">Size: {product.size}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
