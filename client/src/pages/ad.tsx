import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ShippingForm from '@/components/shipping-form';
import PaymentModal from '@/components/payment-modal';
import { subscribeToEvents, parseAdEvent } from '@/lib/nostr';
import { NOSTR_KINDS } from '@shared/nostr';
import type { Ad, ShippingInfo } from '@shared/schema';

type Params = {
  id: string;
};

export default function AdPage() {
  const params = useParams<Params>();
  const [showPayment, setShowPayment] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>();

  const { data: ad } = useQuery<Ad | undefined>({
    queryKey: ['ad', params.id],
    queryFn: async () => {
      if (!params.id) return undefined;

      let foundAd: Ad | undefined;
      let unsubscribe: (() => void) | undefined;

      await new Promise<void>((resolve) => {
        unsubscribe = subscribeToEvents(
          { kinds: [NOSTR_KINDS.CLASSIFIED_AD], ids: [params.id] },
          (event) => {
            try {
              foundAd = parseAdEvent(event);
            } catch (e) {
              console.error('Failed to parse ad event:', e);
            }
          }
        );
        setTimeout(resolve, 5000);
      });

      if (unsubscribe) unsubscribe();
      if (!foundAd) throw new Error('Ad not found');
      return foundAd;
    },
    enabled: !!params.id
  });

  if (!ad) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
          <p className="text-lg mb-4">{ad.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold">
              {ad.price} {ad.currency}
            </span>
            {ad.discount && (
              <span className="text-green-600">
                {ad.discount}% discount available
              </span>
            )}
          </div>

          {ad.deliveryType !== 'no_info' && (
            <ShippingForm
              deliveryType={ad.deliveryType}
              onSubmit={setShippingInfo}
            />
          )}

          <Button 
            size="lg"
            onClick={() => setShowPayment(true)}
            disabled={ad.deliveryType !== 'no_info' && !shippingInfo}
          >
            Buy Now
          </Button>
        </CardContent>
      </Card>

      {showPayment && (
        <PaymentModal
          ad={ad}
          shippingInfo={shippingInfo}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}