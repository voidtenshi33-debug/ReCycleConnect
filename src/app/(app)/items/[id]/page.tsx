
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { items, users } from "@/lib/data";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Flag, MessageSquare, Share2, Star, ShieldCheck, CreditCard } from "lucide-react";
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
                            {item.imageUrls.slice(0, 5).map((img, index) => (
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
                         <div className="text-4xl font-bold text-primary pt-2">
                            {item.listingType === 'Donate' ? 'FREE for Donation' : `₹${item.price.toLocaleString()}`}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <Badge variant="secondary" className="text-sm">{item.category}</Badge>
                            <Badge variant="outline" className="text-sm">{item.condition}</Badge>
                             {item.isFeatured && <Badge>⭐ Featured</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h2 className="font-semibold text-lg mb-2">Description</h2>
                        <p className="text-base leading-relaxed text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>

                {/* Location */}
                 <Card>
                    <CardHeader>
                         <h2 className="font-semibold text-lg">Location</h2>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                            <p className="text-muted-foreground">Map snippet for {item.locality}</p>
                        </div>
                    </CardContent>
                </Card>

            </div>
            
            <div className="md:col-span-1 space-y-6">
                {/* Action Card at the bottom for mobile, sticky for desktop */}
                <div className="md:sticky md:top-6 space-y-6">
                     {/* Seller Card */}
                    {seller && (
                        <Card>
                            <CardHeader>
                                <h2 className="font-semibold text-lg">Seller Information</h2>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 mb-4">
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
                                         <span className="text-sm text-muted-foreground">Joined {new Date(seller.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                {seller.isTrusted && (
                                     <div className="flex items-center gap-2 text-sm text-blue-800 font-medium p-2 bg-blue-50 border border-blue-200 rounded-md">
                                         <ShieldCheck className="w-5 h-5 text-blue-600"/>
                                        <span>Recycleconnect Trusted Seller</span>
                                    </div>
                                )}
                                <Button variant="outline" className="w-full mt-4" asChild>
                                    <Link href={`/users/${seller.id}`}>
                                        View Full Profile <ChevronRight className="w-4 h-4 ml-auto" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            {seller?.isTrusted ? (
                                <>
                                    <Button size="lg" className="w-full font-bold">
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Buy Now - ₹{item.price.toLocaleString()}
                                    </Button>
                                    <Button size="lg" variant="outline" className="w-full">
                                        <MessageSquare className="mr-2 h-5 w-5"/> Chat with Seller
                                    </Button>
                                </>
                            ) : (
                                <Button size="lg" className="w-full font-bold">
                                    <MessageSquare className="mr-2 h-5 w-5"/> Chat with Seller
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Safety & Reporting */}
                     <div className="space-y-2 text-sm text-muted-foreground text-center">
                         <div className="p-3 bg-muted text-muted-foreground rounded-md text-xs">
                            Safety Tip: Always meet in a public place and inspect the item before you pay.
                         </div>
                        <div className="flex justify-around pt-2">
                             <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                                <Share2 className="w-4 h-4"/> Share
                            </Button>
                             <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
                                 <Flag className="w-4 h-4"/> Report
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


    