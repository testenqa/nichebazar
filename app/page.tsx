'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { businessCategories } from '@/data/businesses';
import BusinessCard from '@/components/BusinessCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import type { Business } from '@/types/business';
import AppHeader from '@/components/AppHeader';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchBusinesses = async () => {
      try {
        const res = await fetch('/api/businesses?onlyVerified=true', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        const mapped: Business[] = rows.map((b: any) => ({
          id: b.id || String(Math.random()),
          name: b.name,
          description: b.description,
          category: b.category,
          address: b.address ?? '',
          city: b.city ?? '',
          state: b.state ?? '',
          zipCode: b.zip_code ?? '',
          phone: b.phone ?? '',
          email: b.email ?? '',
          website: b.website ?? undefined,
          rating: typeof b.rating === 'number' ? b.rating : 0,
          reviewCount: typeof b.review_count === 'number' ? b.review_count : 0,
          imageUrl: b.image_url || undefined,
          tags: Array.isArray(b.tags) ? b.tags : [],
          isVerified: !!b.is_verified,
          createdAt: b.created_at || new Date().toISOString(),
        }));
        if (isMounted) setBusinesses(mapped);
      } catch (_) {
        if (isMounted) setBusinesses([]);
      }
    };
    fetchBusinesses();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        business.name.toLowerCase().includes(q) ||
        business.description.toLowerCase().includes(q) ||
        business.city.toLowerCase().includes(q) ||
        business.state.toLowerCase().includes(q);

      const matchesCategory = selectedCategory === null || business.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, businesses]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Find the Perfect Business for Your Needs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover local businesses, read reviews, and connect with trusted professionals across various industries.</p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="max-w-2xl mx-auto">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search by business name, description, or location..." />
          </div>
          <div className="flex justify-center">
            <CategoryFilter categories={businessCategories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Showing {filteredBusinesses.length} of {businesses.length} businesses</p>
        </div>

        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No approved businesses yet</h3>
            <p className="text-gray-600">Check back later or adjust your search.</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 NicheBazar. All rights reserved.</p>
            <p className="mt-2 text-sm">Connecting businesses with customers since 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
