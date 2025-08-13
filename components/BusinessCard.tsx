'use client';

import { Business } from '@/types/business';
import { StarIcon, MapPinIcon, PhoneIcon, GlobeAltIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface BusinessCardProps {
  business: Business;
  className?: string;
}

export default function BusinessCard({ business, className }: BusinessCardProps) {
  const router = useRouter();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon key="half" className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" />
      );
    }

    return stars;
  };

  const showImage = Boolean(business.imageUrl);

  const onNavigate = () => {
    if (business.id) router.push(`/business/${business.id}`);
  };

  // No cart actions on business card; cart is handled on product cards

  return (
    <div
      onClick={onNavigate}
      className={cn(
        "group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer",
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onNavigate() }}
    >
      {/* Media Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {showImage ? (
          <img
            src={business.imageUrl}
            alt={`${business.name} logo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-600/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-20">
                {business.category === 'Technology' && '💻'}
                {business.category === 'Food & Beverage' && '🍽️'}
                {business.category === 'Health & Fitness' && '💪'}
                {business.category === 'Design & Marketing' && '🎨'}
                {business.category === 'Real Estate' && '🏠'}
                {business.category === 'Automotive' && '🚗'}
                {business.category === 'Pet Services' && '🐾'}
                {business.category === 'Legal Services' && '⚖️'}
              </div>
            </div>
          </div>
        )}

        {business.isVerified && (
          <div className="absolute top-3 right-3">
            <CheckBadgeIcon className="w-6 h-6 text-blue-600 bg-white rounded-full p-1" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {business.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {business.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(business.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {business.rating} ({business.reviewCount} reviews)
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPinIcon className="w-4 h-4 text-gray-400" />
          <span>{business.city}, {business.state}</span>
        </div>

        {/* Contact Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <PhoneIcon className="w-4 h-4 text-gray-400" />
            <span>{business.phone}</span>
          </div>
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <GlobeAltIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
