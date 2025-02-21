import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Ad, AffiliateLink } from '@shared/schema';

type AdCardProps = {
  ad: Ad;
  affiliateLink?: AffiliateLink;
};

export default function AdCard({ ad, affiliateLink }: AdCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {ad.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold">
            {ad.price} {ad.currency}
          </span>
          {ad.discount && (
            <span className="text-sm text-green-600">
              {ad.discount}% off
            </span>
          )}
        </div>

        {ad.deliveryType !== 'no_info' && (
          <div className="text-sm text-muted-foreground">
            Requires: {ad.deliveryType === 'email_only' ? 'Email' : 'Shipping Info'}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/ad/${ad.id}`}>
          <Button className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
