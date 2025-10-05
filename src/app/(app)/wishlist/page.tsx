import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";

function EmptyWishlist() {
    return (
        <div className="text-center flex flex-col items-center gap-4 mt-8 md:mt-16">
            <Image 
                src="https://picsum.photos/seed/emptybox/400/300"
                width={200}
                height={150}
                alt="Empty box"
                className="opacity-50 rounded-lg"
                data-ai-hint="empty box"
            />
            <h2 className="font-headline text-2xl font-semibold mt-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground max-w-sm">
                You haven't saved any items yet. Start exploring and tap the heart icon to save your favorites.
            </p>
            <Button asChild>
                <Link href="/home">
                    <Heart className="mr-2 h-4 w-4" /> Start Exploring
                </Link>
            </Button>
        </div>
    )
}

export default function WishlistPage() {
    // In a real app, you would fetch the user's wishlist
    const wishlistItems: any[] = [];

    if (wishlistItems.length === 0) {
        return <EmptyWishlist />;
    }

    return (
        <div>
            <h1 className="text-2xl font-headline font-semibold mb-4">My Wishlist</h1>
            {/* Grid of ItemCards would go here */}
        </div>
    )
}
