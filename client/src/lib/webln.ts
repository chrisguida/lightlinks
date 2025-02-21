import { requestProvider } from 'webln';

export async function makePayment(invoice: string): Promise<string> {
  try {
    const webln = await requestProvider();
    const { preimage } = await webln.sendPayment(invoice);
    return preimage;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Payment failed: ${message}`);
  }
}

export async function generateZapRequest(
  amount: number,
  recipientPubkey: string,
  affiliateEventId: string,
  relayUrl: string
): Promise<string> {
  const zapRequest = {
    kind: 9734,
    content: "",
    tags: [
      ["p", recipientPubkey],
      ["amount", amount.toString()],
      ["relays", relayUrl],
      ["e", affiliateEventId, relayUrl]
    ]
  };

  try {
    const webln = await requestProvider();
    const { paymentRequest } = await webln.makeInvoice({
      amount,
      defaultMemo: JSON.stringify(zapRequest)
    });

    return paymentRequest;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to generate invoice: ${message}`);
  }
}