import { SimplePool, getPublicKey, nip19, type Filter } from 'nostr-tools';
import type { NostrEvent, NostrFilter } from '@shared/nostr';
import { NOSTR_KINDS } from '@shared/nostr';
import type { Ad, AffiliateLink } from '@shared/schema';

const DEFAULT_RELAYS = [
  'wss://relay.damus.io',  // Primary relay for marketplace events
  // 'wss://relay.snort.social',
  // 'wss://relay.current.fyi'
];

// Initialize pool without options as per nostr-tools API
const pool = new SimplePool();

// Log relay connection attempts
console.log('Initializing Nostr pool with relays:', DEFAULT_RELAYS);

export async function publishEvent(event: NostrEvent): Promise<string> {
  try {
    console.log('Publishing event to relays:', event);
    const pub = await pool.publish(DEFAULT_RELAYS, event);
    console.log('Event published successfully');
    return event.id;
  } catch (error) {
    console.error('Failed to publish event:', error);
    throw new Error(`Failed to publish event: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
export async function subscribeToEvents(
  filter: Filter,
  onEvent: (event: Event) => void
): Promise<() => void> {
  try {
    console.log('Subscribing to events with filter:', filter);

    // Fetch past events using querySync()
    const events = await pool.querySync(DEFAULT_RELAYS, filter);
    events.forEach((event) => {
      console.log("Received past event:", event);
      onEvent(event);
    });

    // Subscribe to live events using subscribeMany()
    const sub = pool.subscribeMany(DEFAULT_RELAYS, [filter], {
      onevent: (event) => {
        console.log("Live event received:", event);
        onEvent(event);
      },
      onclose: (reasons) => {
        console.log("Subscription closed:", reasons);
      }
    });

    // Return cleanup function
    return () => {
      console.log("Unsubscribing from live events");
      sub.close();
    };

  } catch (error) {
    console.error("Error subscribing to events:", error);
    return () => {};
  }
}


export function parseAdEvent(event: NostrEvent): Ad {
  console.log('Parsing ad event:', event);
  try {
    const title = event.tags.find(t => t[0] === 'title')?.[1] || 'Untitled';
    const price = event.tags.find(t => t[0] === 'price')?.[1] || 'Unknown';
    const image = event.tags.find(t => t[0] === 'image')?.[1] || null;
    const location = event.tags.find(t => t[0] === 'location')?.[1] || 'Unknown';

    return {
      id: event.id,
      pubkey: event.pubkey,
      title,
      description: event.content || '',
      price,
      location,
      image,
      relayUrl: DEFAULT_RELAYS[0]
    };
  } catch (error) {
    console.error('Failed to parse ad event:', error);
    throw new Error(`Failed to parse ad event: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function parseAffiliateEvent(event: NostrEvent): AffiliateLink {
  console.log('Parsing affiliate event:', event);
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