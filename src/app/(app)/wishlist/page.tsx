
'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useFirebase } from "@/firebase";
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
    const { user, isUserLoading } = useFirebase();
    const userProfile = users.find(u => u.userId === user?.uid);
    const wishlistIds = userProfile?.wishlist || [];

    const wishlistItems = useMemo(() => {
        if (isUserLoading) return [];
        return allItems.filter(item => wishlistIds.includes(item.id));
    }, [isUserLoading, wishlistIds]);
    
    if (!isUserLoading && wishlistItems.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-headline font-semibold">My Wishlist</h1>
             {isUserLoading ? (
                <p>Loading...</p>
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
