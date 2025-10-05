
'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useUser } from "@/firebase";
import { useMemo } from 'react';
import { items as allItems, users } from "@/lib/data";
import { ItemCard } from "@/components/item-card";

function EmptyWishlist() {
    return (
        <div className="text-center flex flex-col items-center gap-4 mt-8 md:mt-16">
            <div className="p-6 bg-muted rounded-full">
                <Heart className="w-16 h-16 text-muted-foreground/50" />
            </div>
            <h2 className="font-headline text-2xl font-semibold mt-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground max-w-sm">
                You haven't saved any items yet. Start exploring and tap the heart icon to save your favorites.
            </p>
            <Button asChild>
                <Link href="/home">
                    <Search className="mr-2 h-4 w-4" /> Start Exploring
                </Link>
            </Button>
        </div>
    )
}

export default function WishlistPage() {
    const { user, isUserLoading } = useUser();
    
    // In a real app, userProfile would be fetched from Firestore.
    // Here we find the mock user profile. For this to work, we'll assume user_01 is logged in.
    const loggedInUserId = user?.uid || "user_01";
    const userProfile = users.find(u => u.userId === loggedInUserId);
    const wishlistIds = userProfile?.wishlist || [];

    const wishlistItems = useMemo(() => {
        if (isUserLoading || !userProfile) return [];
        return allItems.filter(item => wishlistIds.includes(item.id));
    }, [isUserLoading, userProfile, wishlistIds]);
    
    if (!isUserLoading && wishlistItems.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-semibold">My Wishlist</h1>
             {isUserLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="aspect-[4/3] w-full bg-muted rounded-lg animate-pulse" />
                            <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                            <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
                            <div className="h-5 bg-muted rounded w-1/4 animate-pulse" />
                        </div>
                    ))}
                </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {wishlistItems.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
             )}
        </div>
    )
}
