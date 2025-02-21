import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import AdCard from '@/components/ad-card';
import { subscribeToEvents, parseAdEvent, parseAffiliateEvent } from '@/lib/nostr';
import { NOSTR_KINDS } from '@shared/nostr';
import type { Ad, AffiliateLink } from '@shared/schema';

export default function Home() {
  const { data: ads = [] } = useQuery<Ad[]>({
    queryKey: ['ads'],
    queryFn: async () => {
      const ads: Ad[] = [];
      let unsubscribe: (() => void) | undefined;

      await new Promise<void>((resolve) => {
        unsubscribe = subscribeToEvents(
          { kinds: [NOSTR_KINDS.CLASSIFIED_AD] },
          (event) => {
            try {
              ads.push(parseAdEvent(event));
            } catch (e) {
              console.error('Failed to parse ad event:', e);
            }
          }
        );
        setTimeout(resolve, 5000);
      });

      if (unsubscribe) unsubscribe();
      return ads;
    }
  });

  const { data: affiliateLinks = [] } = useQuery<AffiliateLink[]>({
    queryKey: ['affiliate-links'],
    queryFn: async () => {
      const links: AffiliateLink[] = [];
      let unsubscribe: (() => void) | undefined;

      await new Promise<void>((resolve) => {
        unsubscribe = subscribeToEvents(
          { kinds: [NOSTR_KINDS.AFFILIATE_LIST] },
          (event) => {
            try {
              links.push(parseAffiliateEvent(event));
            } catch (e) {
              console.error('Failed to parse affiliate event:', e);
            }
          }
        );
        setTimeout(resolve, 5000);
      });

      if (unsubscribe) unsubscribe();
      return links;
    }
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