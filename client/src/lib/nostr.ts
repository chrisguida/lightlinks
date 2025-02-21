import { SimplePool, getPublicKey, nip19 } from 'nostr-tools';
import type { NostrEvent, NostrFilter } from '@shared/nostr';
import { NOSTR_KINDS } from '@shared/nostr';
import type { Ad, AffiliateLink } from '@shared/schema';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band'
];

// Initialize pool with explicit relays
const pool = new SimplePool();

export async function publishEvent(event: NostrEvent): Promise<string> {
  try {
    const pub = await pool.publish(DEFAULT_RELAYS, event);
    return event.id;
  } catch (error) {
    throw new Error('Failed to publish event');
  }
}

export function subscribeToEvents(
  filter: NostrFilter,
  onEvent: (event: NostrEvent) => void
): () => void {
  const sub = pool.sub(DEFAULT_RELAYS, [filter], {
    onevent: onEvent
  });

  return () => {
    if (sub) sub.unsub();
  };
}

export function parseAdEvent(event: NostrEvent): Ad {
  const content = JSON.parse(event.content);
  return {
    id: event.id,
    pubkey: event.pubkey,
    ...content,
    relayUrl: DEFAULT_RELAYS[0]
  };
}

export function parseAffiliateEvent(event: NostrEvent): AffiliateLink {
  const adEventId = event.tags.find(t => t[0] === 'e')?.[1];
  if (!adEventId) throw new Error('Invalid affiliate event: missing ad reference');

  return {
    id: event.id,
    pubkey: event.pubkey,
    adEventId,
    relayUrl: DEFAULT_RELAYS[0]
  };
}

export function npubToHex(npub: string): string {
  const { data } = nip19.decode(npub);
  return data as string;
}

export function hexToNpub(hex: string): string {
  return nip19.npubEncode(hex);
}