
'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Search, Loader2 } from "lucide-react";
import { useCollection, useDoc } from "@/firebase";
import { useMemo } from 'react';
import { ItemCard } from "@/components/item-card";
import { collection, query, where, doc } from "firebase/firestore";
import type { Item, User as UserProfile } from '@/lib/types';
import { useFirebase } from "@/firebase/provider";
import { useMemoFirebase } from "@/firebase/provider";

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

function WishlistSkeleton() {
    return (
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
    )
}


export default function WishlistPage() {
    const { firestore, user, isUserLoading } = useFirebase();
    
    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);
    
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    const wishlistIds = useMemo(() => userProfile?.wishlist || [], [userProfile]);

    const wishlistQuery = useMemoFirebase(() => {
        if (!firestore || wishlistIds.length === 0) return null;
        return query(collection(firestore, 'items'), where('__name__', 'in', wishlistIds));
    }, [firestore, wishlistIds]);
    
    const { data: wishlistItems, isLoading: areItemsLoading } = useCollection<Item>(wishlistQuery);
    
    const isLoading = isUserLoading || isProfileLoading || (wishlistIds.length > 0 && areItemsLoading);
    
    if (isLoading) {
        return (
             <div className="space-y-6">
                <h1 className="text-2xl md:text-3xl font-headline font-semibold">My Wishlist</h1>
                <WishlistSkeleton />
            </div>
        )
    }

    if (!isLoading && wishlistItems?.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-headline font-semibold">My Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {wishlistItems?.map(item => (
                    <ItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}
