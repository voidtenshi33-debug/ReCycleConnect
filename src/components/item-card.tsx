
'use client'

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Zap } from "lucide-react"

import type { Item } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/firebase"
import { users } from "@/lib/data"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { T } from "./t"

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const { user, isUserLoading } = useUser();
  
  // In a real app, this would come from a Firestore hook or a context provider
  // For now, we simulate finding the logged-in user from our mock data.
  // We'll default to 'user_01' if Firebase auth is loading or there's no user.
  const loggedInUserId = user?.uid || "user_01"; 
  const userProfile = users.find(u => u.userId === loggedInUserId);
  
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    // Initialize wishlist state based on the current user's data
    if (userProfile?.wishlist) {
      setIsWishlisted(userProfile.wishlist.includes(item.id));
    }
  }, [userProfile, item.id]);

  const handleWishlistToggle = () => {
    // In a real app, we would check for the user object before proceeding
    if (isUserLoading || !userProfile) return;
    
    // This is where you would call the Firestore update logic.
    // For now, we just toggle the state locally for immediate UI feedback.
    const newWishlistedState = !isWishlisted;
    setIsWishlisted(newWishlistedState);

    // Mock update the local user data object to simulate the database change
    // This is a temporary solution for the prototype.
    if (newWishlistedState) {
        userProfile.wishlist.push(item.id);
    } else {
        const index = userProfile.wishlist.indexOf(item.id);
        if (index > -1) {
            userProfile.wishlist.splice(index, 1);
        }
    }

    console.log(`Item ${item.id} ${newWishlistedState ? 'added to' : 'removed from'} wishlist for user ${userProfile.userId}.`);
    // In a real app, you'd use a Firestore function:
    // const userRef = doc(db, 'users', user.uid);
    // await updateDoc(userRef, {
    //   wishlist: newWishlistedState ? arrayUnion(item.id) : arrayRemove(item.id)
    // });
  }

  const categoryName = typeof item.category === 'string' ? item.category : item.category.name;

  return (
    <Card className="w-full overflow-hidden flex flex-col transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/items/${item.id}`}>
          <div className="relative aspect-[4/3] w-full">
            <Image
              alt={item.title}
              className="object-cover"
              fill
              src={item.imageUrls[0]}
              data-ai-hint="product image"
            />
          </div>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70 group"
          onClick={handleWishlistToggle}
          disabled={isUserLoading}
          aria-label="Toggle Wishlist"
        >
            <Heart className={cn("w-5 h-5 text-destructive transition-all group-hover:scale-110", isWishlisted && "fill-destructive")} />
        </Button>
         <div className="absolute top-2 left-2 flex gap-2">
            {item.isFeatured && (
                <Badge variant="default" className="bg-yellow-400 text-yellow-900 gap-1 pr-3">
                    <Zap className="w-3.5 h-3.5" /> <T>Featured</T>
                </Badge>
            )}
            <Badge variant="secondary"><T>{item.condition}</T></Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow grid gap-2">
         <Link href={`/items/${item.id}`}>
            <CardTitle className="font-headline text-lg hover:underline leading-tight"><T>{item.title}</T></CardTitle>
          </Link>
        <div className="text-2xl font-bold text-primary">
          {item.listingType === 'Donate' ? <T>DONATE</T> : `₹${item.price.toLocaleString('en-IN')}`}
        </div>
        <p className="text-sm text-muted-foreground">📍 {item.locality}</p>
      </CardContent>
      <CardFooter className="p-0">
        <Button asChild className="w-full rounded-t-none">
          <Link href={`/items/${item.id}`}>
            <T>View Now</T>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
