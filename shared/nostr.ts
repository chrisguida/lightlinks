export const NOSTR_KINDS = {
  METADATA: 0,
  CLASSIFIED_AD: 30402,
  AFFILIATE_LIST: 13166,
  ZAP_REQUEST: 9734
} as const;

export type NostrEvent = {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
};

export type NostrFilter = {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  since?: number;
  until?: number;
  limit?: number;
  [key: `#${string}`]: string[];
};
