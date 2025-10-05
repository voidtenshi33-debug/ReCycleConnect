export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  memberSince: string;
  location: string;
  rating: number;
  reviews: number;
};

export type Category = 'Laptops' | 'Phones' | 'Tablets' | 'Monitors' | 'Cameras' | 'Audio' | 'Accessories' | 'Other';

export type ItemCondition = 'Working' | 'Needs Minor Repair' | 'For Spare Parts Only';

export type Item = {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: Category;
  condition: ItemCondition;
  price: number;
  isFree: boolean;
  location: string;
  postedAt: string;
  sellerId: string;
  status: 'Available' | 'In Process' | 'Completed';
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
  id: string;
  itemId: string;
  raterId: string;
  ratedUserId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
};

export type ExchangeRequest = {
  id: string;
  itemId: string;
  requesterId: string;
  sellerId: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  createdAt: string;
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
