import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { generateZapRequest, makePayment } from '@/lib/webln';
import type { Ad, ShippingInfo } from '@shared/schema';

type PaymentModalProps = {
  ad: Ad;
  shippingInfo?: ShippingInfo;
  onClose: () => void;
};

export default function PaymentModal({ ad, shippingInfo, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const amount = ad.discount 
        ? ad.price * (1 - ad.discount / 100)
        : ad.price;

      const invoice = await generateZapRequest(
        amount,
        ad.pubkey,
        ad.id,
        ad.relayUrl
      );

      await makePayment(invoice);

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully."
      });

      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-lg">
            <span className="font-semibold">Amount:</span>{' '}
            {ad.price} {ad.currency}
          </div>

          {ad.discount && (
            <div className="text-green-600">
              Discount: {ad.discount}% off
            </div>
          )}

          {shippingInfo && (
            <div className="text-sm text-muted-foreground">
              <div>Delivery to:</div>
              <div>{shippingInfo.name}</div>
              <div>{shippingInfo.email}</div>
              {shippingInfo.address && (
                <>
                  <div>{shippingInfo.address}</div>
                  <div>
                    {shippingInfo.city}, {shippingInfo.country} {shippingInfo.postalCode}
                  </div>
                </>
              )}
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay with Lightning"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
