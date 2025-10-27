
import type { Timestamp } from "firebase/firestore";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: string;
  isPublished: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: 'active' | 'canceled' | 'incomplete' | 'trialing' | string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
