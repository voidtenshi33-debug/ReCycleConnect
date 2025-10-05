import type { User, Item, Category, Conversation, ChatMessage, ExchangeRequest, Notification, AppCategory } from './types';
import { Smartphone, Laptop, Keyboard, Monitor, Plug, Cable, Headphones, Speaker, MemoryStick, HardDrive, SquarePlus } from 'lucide-react';

export const users: User[] = [
  { id: 'user-1', name: 'Jane Doe', avatarUrl: 'https://picsum.photos/seed/user1/100/100', memberSince: '2023-05-15', location: 'San Francisco, CA', rating: 4.8, reviews: 24 },
  { id: 'user-2', name: 'John Smith', avatarUrl: 'https://picsum.photos/seed/user2/100/100', memberSince: '2022-11-20', location: 'New York, NY', rating: 4.5, reviews: 12 },
  { id: 'user-3', name: 'Alex Ray', avatarUrl: 'https://picsum.photos/seed/user3/100/100', memberSince: '2024-01-10', location: 'Austin, TX', rating: 5.0, reviews: 8 },
];

export const items: Item[] = [
  { id: 'item-1', title: 'MacBook Pro 14"', description: 'Slightly used MacBook Pro with M1 Pro chip. Great condition, comes with charger.', images: ['https://picsum.photos/seed/laptop1/600/400', 'https://picsum.photos/seed/laptop2/600/400'], category: 'Laptops', condition: 'Working', price: 950, isFree: false, location: 'San Francisco, CA', postedAt: '2 days ago', sellerId: 'user-1', status: 'Available' },
  { id: 'item-2', title: 'iPhone 12 for parts', description: 'Screen is cracked and does not turn on. Good for spare parts.', images: ['https://picsum.photos/seed/phone1/600/400'], category: 'Phones', condition: 'For Spare Parts Only', price: 50, isFree: false, location: 'New York, NY', postedAt: '5 days ago', sellerId: 'user-2', status: 'Available' },
  { id: 'item-3', title: 'Dell UltraSharp 27" Monitor', description: 'Free monitor, works perfectly but has one dead pixel cluster. Includes stand and power cable.', images: ['https://picsum.photos/seed/monitor1/600/400'], category: 'Monitors', condition: 'Needs Minor Repair', price: 0, isFree: true, location: 'Austin, TX', postedAt: '1 week ago', sellerId: 'user-3', status: 'Available' },
  { id: 'item-4', title: 'Sony WH-1000XM4 Headphones', description: 'Excellent noise-cancelling headphones. Used for a year, works like new.', images: ['https://picsum.photos/seed/headphones1/600/400'], category: 'Audio', condition: 'Working', price: 150, isFree: false, location: 'San Francisco, CA', postedAt: '1 day ago', sellerId: 'user-1', status: 'Available' },
  { id: 'item-5', title: 'Canon EOS R6 Camera Body', description: 'Professional full-frame mirrorless camera. Shutter count around 15k. Minor cosmetic wear.', images: ['https://picsum.photos/seed/camera1/600/400'], category: 'Cameras', condition: 'Working', price: 1800, isFree: false, location: 'New York, NY', postedAt: '10 days ago', sellerId: 'user-2', status: 'In Process' },
  { id: 'item-6', title: 'iPad Air (4th Gen)', description: 'Donating this iPad Air. It has a small dent on the corner but otherwise works perfectly. No charger included.', images: ['https://picsum.photos/seed/tablet1/600/400'], category: 'Tablets', condition: 'Working', price: 0, isFree: true, location: 'Austin, TX', postedAt: '3 days ago', sellerId: 'user-3', status: 'Completed' },
];

export const conversations: (Conversation & { messages: ChatMessage[] })[] = [
    {
        id: 'convo-1',
        itemId: 'item-5',
        participants: ['user-1', 'user-2'],
        lastMessage: { id: 'msg-2', senderId: 'user-1', text: 'Sounds good, let me know when you ship it.', timestamp: '10:30 AM', isRead: false },
        messages: [
            { id: 'msg-1', senderId: 'user-2', text: 'I can accept your offer. I will be able to ship it tomorrow.', timestamp: '10:28 AM', isRead: true },
            { id: 'msg-2', senderId: 'user-1', text: 'Sounds good, let me know when you ship it.', timestamp: '10:30 AM', isRead: false },
        ]
    },
    {
        id: 'convo-2',
        itemId: 'item-2',
        participants: ['user-3', 'user-2'],
        lastMessage: { id: 'msg-3', senderId: 'user-3', text: 'Is this still available?', timestamp: 'Yesterday', isRead: true },
        messages: [
            { id: 'msg-3', senderId: 'user-3', text: 'Is this still available?', timestamp: 'Yesterday', isRead: true },
        ]
    }
];

export const exchangeRequests: ExchangeRequest[] = [
    { id: 'req-1', itemId: 'item-1', requesterId: 'user-2', sellerId: 'user-1', status: 'Pending', createdAt: '1 day ago' },
    { id: 'req-2', itemId: 'item-4', requesterId: 'user-3', sellerId: 'user-1', status: 'Accepted', createdAt: '12 hours ago' },
    { id: 'req-3', itemId: 'item-3', requesterId: 'user-1', sellerId: 'user-3', status: 'Completed', createdAt: '5 days ago' },
    { id: 'req-4', itemId: 'item-2', requesterId: 'user-1', sellerId: 'user-2', status: 'Rejected', createdAt: '3 days ago' },
];

export const notifications: Notification[] = [
    { id: 'notif-1', userId: 'user-1', type: 'request_received', text: 'John Smith sent a request for your MacBook Pro 14".', link: '/exchanges', isRead: false, createdAt: '1 day ago' },
    { id: 'notif-2', userId: 'user-2', type: 'request_accepted', text: 'Jane Doe accepted your request for the Sony Headphones.', link: '/exchanges', isRead: true, createdAt: '12 hours ago' },
    { id: 'notif-3', userId: 'user-3', type: 'new_rating', text: 'Jane Doe left you a 5-star rating!', link: '/users/user-3', isRead: true, createdAt: '4 days ago' },
];

export const itemCategories: Category[] = ['Laptops', 'Phones', 'Tablets', 'Monitors', 'Cameras', 'Audio', 'Accessories', 'Other'];

export const categories: AppCategory[] = [
  { id: 'mobiles', name: 'Mobiles', icon: Smartphone, slug: 'mobiles' },
  { id: 'laptops', name: 'Laptops', icon: Laptop, slug: 'laptops' },
  { id: 'keyboards', name: 'Keyboards', icon: Keyboard, slug: 'keyboards-mice' },
  { id: 'monitors', name: 'Monitors', icon: Monitor, slug: 'monitors' },
  { id: 'cables', name: 'Cables', icon: Cable, slug: 'chargers-cables' },
  { id: 'audio', name: 'Audio', icon: Headphones, slug: 'audio-devices' },
  { id: 'components', name: 'Components', icon: MemoryStick, slug: 'components' },
  { id: 'other', name: 'Other', icon: SquarePlus, slug: 'other-accessories' },
];
