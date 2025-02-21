import { useQuery } from '@tanstack/react-query';
import AdCard from '@/components/ad-card';
import { mockAds, mockAffiliateLinks } from '@/lib/mock-data';
import type { Ad, AffiliateLink } from '@shared/schema';

export default function Home() {
  // Use mock data with react-query for consistent API
  const { data: ads = [] } = useQuery<Ad[]>({
    queryKey: ['ads'],
    queryFn: async () => mockAds,
  });

  const { data: affiliateLinks = [] } = useQuery<AffiliateLink[]>({
    queryKey: ['affiliate-links'],
    queryFn: async () => mockAffiliateLinks,
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Nostr Marketplace
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <AdCard 
            key={ad.id} 
            ad={ad}
            affiliateLink={affiliateLinks.find(l => l.adEventId === ad.id)}
          />
        ))}
      </div>
    </div>
  );
}