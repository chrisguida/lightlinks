import type { Ad, AffiliateLink } from '@shared/schema';

export const mockAds: Ad[] = [
  {
    id: "1",
    pubkey: "e096a89eeb90820895a6dfd7f369ec313654e5762e042d59ad069376593514",
    title: "Homemade Pecan Butter",
    description: "Delicious pecan butter sourced from local pecans here in the south east USA! Put it on bananas, dates, toast, chicken, steak or just eat it right out of the jar. Ingredients: pecans, maple sugar, sea salt, cinnamon and black pepper.",
    price: 15.99,
    currency: "USD",
    deliveryType: "shipping_info",
    images: ["https://images.unsplash.com/photo-1590004987873-2704e868a85f?w=500"],
    relayUrl: "wss://relay.damus.io"
  },
  {
    id: "2",
    pubkey: "e096a89eeb90820895a6dfd7f369ec313654e5762e042d59ad069376593514",
    title: "Handcrafted Wooden Spoons",
    description: "Set of 3 handcrafted wooden spoons made from sustainable maple wood. Perfect for cooking and serving.",
    price: 24.99,
    currency: "USD",
    deliveryType: "shipping_info",
    discount: 10,
    relayUrl: "wss://relay.damus.io"
  },
  {
    id: "3",
    pubkey: "e096a89eeb90820895a6dfd7f369ec313654e5762e042d59ad069376593514",
    title: "Digital Photography Course",
    description: "Learn professional photography techniques with this comprehensive digital course. Includes 10 hours of video content.",
    price: 49.99,
    currency: "USD",
    deliveryType: "email_only",
    relayUrl: "wss://relay.damus.io"
  }
];

export const mockAffiliateLinks: AffiliateLink[] = [
  {
    id: "aff1",
    pubkey: "e096a89eeb90820895a6dfd7f369ec313654e5762e042d59ad069376593514",
    adEventId: "1",
    relayUrl: "wss://relay.damus.io"
  }
];
