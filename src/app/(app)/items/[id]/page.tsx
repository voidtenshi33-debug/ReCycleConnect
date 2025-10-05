
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { items, users } from "@/lib/data";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Flag, MessageSquare, Share2, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ItemDetailPage({ params }: { params: { id: string } }) {
    const item = items.find(i => i.id === params.id);
    if (!item) {
        notFound();
    }
    const seller = users.find(u => u.userId === item.ownerId);

    return (
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div className="md:col-span-2 space-y-6">
                <Link href="/home" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to listings
                </Link>
                {/* Image Gallery */}
                <Card className="overflow-hidden">
                    <div className="relative aspect-video w-full">
                        <Image src={item.imageUrls[0]} alt={item.title} fill className="object-cover" data-ai-hint="product photo" />
                    </div>
                    {item.imageUrls.length > 1 && (
                        <div className="p-2 grid grid-cols-5 gap-2">
                            {item.imageUrls.map((img, index) => (
                                <div key={index} className={`relative aspect-square rounded-md overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-transparent'}`}>
                                    <Image src={img} alt={`${item.title} thumbnail ${index + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Item Details */}
                <Card>
                    <CardHeader>
                        <h1 className="font-headline text-3xl font-bold">{item.title}</h1>
                        <div className="flex items-center gap-4 text-muted-foreground pt-2">
                            <span>{item.locality}</span>
                            <span>•</span>
                            <span>Posted {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="secondary" className="text-sm">{item.category}</Badge>
                            <Badge variant="outline" className="text-sm">{item.condition}</Badge>
                        </div>
                        <p className="text-lg leading-relaxed">{item.description}</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="md:col-span-1 space-y-6">
                 {/* Action Card */}
                <Card className="sticky top-6">
                    <CardContent className="p-6 space-y-4">
                        <div className="text-4xl font-bold text-primary">
                            {item.listingType === 'Donate' ? 'DONATE' : `₹${item.price.toLocaleString()}`}
                        </div>
                        <Button size="lg" className="w-full">Request Item</Button>
                        <Button size="lg" variant="outline" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4"/> Chat with Seller
                        </Button>
                    </CardContent>
                </Card>

                {/* Seller Card */}
                {seller && (
                     <Card>
                        <CardContent className="p-6">
                            <p className="text-sm font-medium mb-4 text-muted-foreground">Seller Information</p>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={seller.photoURL ?? undefined} alt={seller.displayName} />
                                    <AvatarFallback>{seller.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5">
                                    <p className="font-semibold">{seller.displayName}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{seller.averageRating.toFixed(1)} ({seller.ratingsCount} reviews)</span>
                                    </div>
                                    <Link href={`/users/${seller.id}`} className="text-sm text-primary hover:underline flex items-center">
                                        View Profile <ChevronRight className="w-4 h-4" />
                                     </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                 {/* Safety & Reporting */}
                 <div className="space-y-2 text-sm text-muted-foreground">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                        <Share2 className="w-4 h-4"/> Share
                    </Button>
                     <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
                         <Flag className="w-4 h-4"/> Report this listing
                    </Button>
                </div>
            </div>
        </div>
    );
}
