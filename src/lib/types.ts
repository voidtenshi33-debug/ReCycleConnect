
import type { LucideIcon } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

export type User = {
  id: string; // Corresponds to document ID user_01, user_02 etc.
  userId: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  phoneNumber?: string;
  createdAt: any; // Firestore Timestamp
  lastKnownLocality: string;
  averageRating: number;
  ratingsCount: number;
  isTrusted: boolean;
  wishlist: string[];
};

export type Category = {
    id: string;
    name: string;
    icon: LucideIcon;
    slug: string;
}

export type AppCategory = {
    id: string;
    name: string;
    icon: LucideIcon;
    slug: string;
}

export type ItemCondition = 'Working' | 'Needs Minor Repair' | 'For Spare Parts Only';

export type Item = {
  id: string;
  title: string;
  description: string;
  category: string;
  brand?: string;
  condition: ItemCondition;
  listingType: "Sell" | "Donate";
  price: number;
  imageUrls: string[];
  locality: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string | null;
  ownerRating: number;
  status: 'Available' | 'In Process' | 'Completed';
  isFeatured: boolean;
  createdAt: any; // Firestore Timestamp
};


export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  itemId: string;
  participants: [string, string]; // [userId, userId]
  lastMessage: ChatMessage;
};

export type Rating = {
  id:string;
  itemId: string;
  raterId: string;
  ratedUserId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: any; // Firestore Timestamp
};

export type ExchangeRequest = {
  id: string;
  itemId: string;
  requesterId: string;
  sellerId: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  createdAt: any; // Firestore Timestamp
};

export type Notification = {
  id: string;
  userId: string;
  type: 'new_message' | 'request_accepted' | 'item_shipped' | 'new_rating' | 'request_received';
  text: string;
  link: string;
  isRead: boolean;
  createdAt: string;
};

export type Location = {
    name: string;
    slug: string;
}
