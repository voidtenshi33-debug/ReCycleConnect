
import type { User, Item, Category, Conversation, ChatMessage, ExchangeRequest, Notification, AppCategory, Location } from './types';
import { Smartphone, Laptop, Keyboard, Monitor, Cable, Headphones, MemoryStick, SquarePlus, Gamepad2, ToyBrick } from 'lucide-react';

export const users: User[] = [
  {
    id: "user_01",
    userId: "user_01",
    displayName: "Rohan Kumar",
    email: "rohan.k@example.com",
    photoURL: "https://i.pravatar.cc/150?u=rohan",
    createdAt: new Date("2025-10-04T13:10:00"),
    lastKnownLocality: "kothrud",
    averageRating: 4.8,
    ratingsCount: 12,
    isTrusted: true,
    wishlist: ['item-3']
  },
  {
    id: "user_02",
    userId: "user_02",
    displayName: "Anjali Sharma",
    email: "anjali.s@example.com",
    photoURL: "https://i.pravatar.cc/150?u=anjali",
    createdAt: new Date("2025-10-03T09:30:00"),
    lastKnownLocality: "viman-nagar",
    averageRating: 4.9,
    ratingsCount: 8,
    isTrusted: true,
    wishlist: []
  },
  {
    id: "user_03",
    userId: "user_03",
    displayName: "Vikram Singh",
    email: "vikram.s@example.com",
    photoURL: null,
    createdAt: new Date("2025-10-01T17:00:00"),
    lastKnownLocality: "hadapsar",
    averageRating: 4.5,
    ratingsCount: 4,
    isTrusted: false,
    wishlist: []
  }
];

export const items: Item[] = [
  {
    id: 'item-1',
    title: "Dell XPS 13 Laptop (2020 Model)",
    description: "Good condition, works perfectly for coding and daily use. Has a few minor scratches on the lid. Comes with original charger.",
    category: "laptops",
    brand: "Dell",
    condition: "Working",
    listingType: "Sell",
    price: 35000,
    imageUrls: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"],
    locality: "kothrud",
    ownerId: "user_01",
    ownerName: "Rohan Kumar",
    ownerAvatarUrl: "https://i.pravatar.cc/150?u=rohan",
    ownerRating: 4.8,
    status: "Available",
    isFeatured: false,
    createdAt: new Date("2025-10-04T13:15:00")
  },
  {
    id: 'item-2',
    title: "Apple iPhone X - For Donation",
    description: "Screen has a crack in the corner but is fully functional. Battery health is at 75%. Good for a spare phone or parts. Giving it away for free.",
    category: "mobiles",
    brand: "Apple",
    condition: "Needs Minor Repair",
    listingType: "Donate",
    price: 0,
    imageUrls: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjIsQWn3Snxqlvj8gM8SBzw7a-pghK6Jf9vg&s"],
    locality: "viman-nagar",
    ownerId: "user_02",
    ownerName: "Anjali Sharma",
    ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
    ownerRating: 4.9,
    status: "Available",
    isFeatured: true,
    createdAt: new Date("2025-10-04T10:00:00")
  },
  {
    id: 'item-3',
    title: "Logitech Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard. All keys and lights working perfectly. Great for gaming and typing.",
    category: "keyboards",
    brand: "Logitech",
    condition: "Working",
    listingType: "Sell",
    price: 2500,
    imageUrls: ["https://images.unsplash.com/photo-1618384887924-2f80214156b2"],
    locality: "hadapsar",
    ownerId: "user_03",
    ownerName: "Vikram Singh",
    ownerAvatarUrl: null,
    ownerRating: 4.5,
    status: "Available",
    isFeatured: false,
    createdAt: new Date("2025-10-03T20:00:00")
  },
  {
    id: 'item-4',
    title: "Samsung 24-inch Monitor (for parts)",
    description: "The monitor does not turn on. Might be an issue with the power supply. The screen panel itself is not cracked. Good for someone who can repair it or use it for spare parts.",
    category: "monitors",
    brand: "Samsung",
    condition: "For Spare Parts Only",
    listingType: "Donate",
    price: 0,
    imageUrls: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrskaQ81mMG3V-uksX9167T0ftbuef1U3wIA&s"],
    locality: "viman-nagar",
    ownerId: "user_02",
    ownerName: "Anjali Sharma",
    ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
    ownerRating: 4.9,
    status: "Available",
    isFeatured: false,
    createdAt: new Date("2025-10-02T11:00:00")
  },
  {
    id: 'item-5',
    title: "Box of Assorted Cables and Chargers",
    description: "Includes various USB-A, Micro USB, and Aux cables. A few old phone chargers also included. All free for anyone who needs them.",
    category: "cables",
    brand: "Assorted",
    condition: "Working",
    listingType: "Donate",
    price: 0,
    imageUrls: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6H22aB9b7P9s2tprbosk_W-W-PBFotnp_wQ&s"],
    locality: "kothrud",
    ownerId: "user_01",
    ownerName: "Rohan Kumar",
    ownerAvatarUrl: "https://i.pravatar.cc/150?u=rohan",
    ownerRating: 4.8,
    status: "Available",
    isFeatured: false,
    createdAt: new Date("2025-10-01T14:00:00")
  },
   {
    id: 'item-6',
    title: "Sony Noise-Cancelling Headphones",
    description: "WH-1000XM4 model. Excellent condition, comes with the original case. The sound quality is amazing.",
    category: "audio",
    brand: "Sony",
    condition: "Working",
    listingType: "Sell",
    price: 8000,
    imageUrls: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlTXVmAszH0kguGi_-CPeVtDGqfb_7AaChUA&s"],
    locality: "baner",
    ownerId: "user_02",
    ownerName: "Anjali Sharma",
    ownerAvatarUrl: "https://i.pravatar.cc/150?u=anjali",
    ownerRating: 4.9,
    status: "Available",
    isFeatured: true,
    createdAt: new Date("2025-10-04T14:00:00")
  }
];


export const conversations: (Conversation & { messages: ChatMessage[] })[] = [
    {
        id: 'convo-1',
        itemId: 'item-1',
        participants: ['user_02', 'user_01'],
        lastMessage: { id: 'msg-2', senderId: 'user_02', text: 'Sounds good, let me know when you can meet.', timestamp: '10:30 AM', isRead: false },
        messages: [
            { id: 'msg-1', senderId: 'user_01', text: 'I can accept your offer. I am free tomorrow afternoon.', timestamp: '10:28 AM', isRead: true },
            { id: 'msg-2', senderId: 'user_02', text: 'Sounds good, let me know when you can meet.', timestamp: '10:30 AM', isRead: false },
        ]
    },
    {
        id: 'convo-2',
        itemId: 'item-2',
        participants: ['user_03', 'user_02'],
        lastMessage: { id: 'msg-3', senderId: 'user_03', text: 'Is this still available?', timestamp: 'Yesterday', isRead: true },
        messages: [
            { id: 'msg-3', senderId: 'user_03', text: 'Is this still available?', timestamp: 'Yesterday', isRead: true },
        ]
    }
];

export const exchangeRequests: ExchangeRequest[] = [
    { id: 'req-1', itemId: 'item-1', requesterId: 'user_02', sellerId: 'user_01', status: 'Pending', createdAt: '1 day ago' },
    { id: 'req-2', itemId: 'item-4', requesterId: 'user_03', sellerId: 'user_01', status: 'Accepted', createdAt: '12 hours ago' },
    { id: 'req-3', itemId: 'item-3', requesterId: 'user_01', sellerId: 'user_03', status: 'Completed', createdAt: '5 days ago' },
    { id: 'req-4', itemId: 'item-2', requesterId: 'user_01', sellerId: 'user_02', status: 'Rejected', createdAt: '3 days ago' },
];

export const notifications: Notification[] = [
    { id: 'notif-1', userId: 'user_01', type: 'request_received', text: 'Anjali Sharma sent a request for your Dell XPS 13 Laptop.', link: '/exchanges', isRead: false, createdAt: '1 day ago' },
    { id: 'notif-2', userId: 'user_02', type: 'request_accepted', text: 'Rohan Kumar accepted your request for the assorted cables.', link: '/exchanges', isRead: true, createdAt: '12 hours ago' },
    { id: 'notif-3', userId: 'user_03', type: 'new_rating', text: 'Rohan Kumar left you a 5-star rating!', link: '/users/user_03', isRead: true, createdAt: '4 days ago' },
];

export const itemCategories: string[] = ['Laptops', 'Phones', 'Tablets', 'Monitors', 'Cameras', 'Audio', 'Accessories', 'Other'];

export const categories: AppCategory[] = [
  { id: 'mobiles', name: 'Mobiles', icon: Smartphone, slug: 'mobiles' },
  { id: 'laptops', name: 'Laptops', icon: Laptop, slug: 'laptops' },
  { id: 'keyboards', name: 'Keyboards', icon: Keyboard, slug: 'keyboards' },
  { id: 'monitors', name: 'Monitors', icon: Monitor, slug: 'monitors' },
  { id: 'cables', name: 'Cables', icon: Cable, slug: 'cables' },
  { id: 'audio', name: 'Audio', icon: Headphones, slug: 'audio' },
  { id: 'components', name: 'Components', icon: MemoryStick, slug: 'components' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, slug: 'gaming' },
  { id: 'drones', name: 'Drones', icon: ToyBrick, slug: 'drones' },
  { id: 'other', name: 'Other', icon: SquarePlus, slug: 'other' },
];

export const locations: Location[] = [
    { name: 'Kothrud, Pune', slug: 'kothrud' },
    { name: 'Viman Nagar, Pune', slug: 'viman-nagar' },
    { name: 'Koregaon Park, Pune', slug: 'koregaon-park' },
    { name: 'Deccan Gymkhana, Pune', slug: 'deccan-gymkhana' },
    { name: 'Pimpri-Chinchwad', slug: 'pimpri-chinchwad' },
    { name: 'Hadapsar, Pune', slug: 'hadapsar' },
    { name: 'Hinjawadi, Pune', slug: 'hinjawadi' },
    { name: 'Baner, Pune', slug: 'baner' },
    { name: 'Wakad, Pune', slug: 'wakad' },
    { name: 'Aundh, Pune', slug: 'aundh' },
]
