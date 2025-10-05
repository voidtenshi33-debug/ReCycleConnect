
'use client'

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Zap, MoreVertical, Trash2, Edit } from "lucide-react"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

import type { Item, User as UserProfile } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useDoc, useFirebase, useUser } from "@/firebase"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { T } from "./t"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMemoFirebase } from "@/firebase/provider";
import { useToast } from "@/hooks/use-toast";


interface ItemCardProps {
  item: Item;
  showControls?: boolean;
  onRemove?: (itemId: string) => void;
}

export function ItemCard({ item, showControls = false, onRemove }: ItemCardProps) {
  const { firestore, user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (userProfile?.wishlist) {
      setIsWishlisted(userProfile.wishlist.includes(item.id));
    }
  }, [userProfile, item.id]);

  const handleWishlistToggle = async () => {
    if (isUserLoading || !user || !userProfileRef) {
        toast({
            variant: "destructive",
            title: "Please log in",
            description: "You need to be logged in to add items to your wishlist.",
        });
        return;
    }
    
    const newWishlistedState = !isWishlisted;
    setIsWishlisted(newWishlistedState); // Optimistic UI update

    try {
      await updateDoc(userProfileRef, {
        wishlist: newWishlistedState ? arrayUnion(item.id) : arrayRemove(item.id)
      });
       toast({
            title: newWishlistedState ? "Added to Wishlist" : "Removed from Wishlist",
        });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setIsWishlisted(!newWishlistedState); // Revert on error
      toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Could not update your wishlist. Please try again.",
      });
    }
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
        
        <div className="absolute top-2 right-2 flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70 group"
              onClick={handleWishlistToggle}
              disabled={isUserLoading}
              aria-label="Toggle Wishlist"
            >
                <Heart className={cn("w-5 h-5 text-destructive transition-all group-hover:scale-110", isWishlisted && "fill-destructive")} />
            </Button>
            
            {showControls && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70">
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRemove?.(item.id)} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remove</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>


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
