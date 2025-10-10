
import type { LucideIcon } from "lucide-react";
import type { Timestamp } from "firebase/firestore";

export type User = {
  id: string; // Corresponds to document ID user_01, user_02 etc.
  userId: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  phoneNumber?: string;
  createdAt: Timestamp | Date;
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

export type ItemCondition = 'Like New' | 'Good' | 'Working' | 'Needs Minor Repair' | 'Needs Major Repair' | 'For Spare Parts Only' | 'Not Working';

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
  status: 'Available' | 'In Process' | 'Completed' | 'Reserved';
  isFeatured: boolean;
  createdAt: Timestamp | Date;
};


export type ChatMessage = {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp | Date;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  participants: string[]; // array of userIds
  itemId: string;
  lastMessage: string;
  lastMessageTimestamp: Timestamp | Date;
  unreadCount: {
    [key: string]: number;
  };
};


export type Rating = {
  id:string;
  itemId: string;
  raterId: string;
  ratedUserId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Timestamp | Date;
};

export type ExchangeRequest = {
  id: string;
  itemId: string;
  requesterId: string;
  sellerId: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  createdAt: Timestamp | Date;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'new_message' | 'request_received' | 'request_accepted' | 'item_shipped' | 'new_rating';
  text: string;
  link: string;
  isRead: boolean;
  createdAt: string;
};

export type Location = {
    name: string;
    slug: string;
}

export type RepairShop = {
    id: string;
    name: string;
    locality: string;
    rating: number;
    services: string[]; // e.g. ["Screen Repair", "Battery Replacement"]
}

