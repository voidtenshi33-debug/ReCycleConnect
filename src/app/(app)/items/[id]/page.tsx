
'use client'

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Flag, MessageSquare, Share2, Star, ShieldCheck, Award, Zap, CheckCircle, Wrench, XCircle, Loader2, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDoc, useFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Item, User } from "@/lib/types";
import { useMemoFirebase } from "@/firebase/provider";

const TrustBadge = ({ icon: Icon, children }: { icon: React.ElementType, children: React.ReactNode }) => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-medium">{children}</span>
    </div>
);

const getConditionIcon = (condition: string) => {
    switch (condition) {
        case 'Like New':
        case 'Good':
        case 'Working':
            return <CheckCircle className="w-3.5 h-3.5 text-green-600" />;
        case 'Needs Minor Repair':
        case 'Needs Major Repair':
            return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
        case 'For Spare Parts Only':
        case 'Not Working':
            return <XCircle className="w-3.5 h-3.5 text-red-600" />;
        default:
            return null;
    }
}

function ItemDetailContent({ itemId }: { itemId: string }) {
    const { firestore } = useFirebase();

    const itemRef = useMemoFirebase(() => firestore ? doc(firestore, 'items', itemId) : null, [firestore, itemId]);
    const { data: item, isLoading: isItemLoading } = useDoc<Item>(itemRef);
    
    const sellerId = item?.ownerId;
    const sellerRef = useMemoFirebase(() => (firestore && sellerId) ? doc(firestore, 'users', sellerId) : null, [firestore, sellerId]);
    const { data: seller, isLoading: isSellerLoading } = useDoc<User>(sellerRef);


    if (isItemLoading || isSellerLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!item) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto">
             <Link href="/home" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to listings
            </Link>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                
                {/* Left Column: Media and Main Details */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Image Carousel */}
                    <Card className="overflow-hidden">
                         <Carousel className="w-full">
                            <CarouselContent>
                                {item.imageUrls.map((img, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative aspect-video w-full">
                                        <Image src={img} alt={`${item.title} image ${index + 1}`} fill className="object-cover" data-ai-hint="product photo" />
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                             {item.imageUrls.length > 1 && (
                                <>
                                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
                                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex"/>
                                </>
                             )}
                        </Carousel>
                    </Card>

                    {/* Core Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl md:text-3xl font-bold">{item.title}</CardTitle>
                             <div className="text-3xl md:text-4xl font-bold text-primary pt-2">
                                {item.listingType === 'Donate' ? 'FREE for Donation' : `₹${item.price.toLocaleString()}`}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                <Badge variant="secondary" className="text-sm">{item.category}</Badge>
                                <Badge variant="outline" className="text-sm flex items-center gap-1">
                                    {getConditionIcon(item.condition)}
                                    {item.condition}
                                </Badge>
                                 {item.isFeatured && <Badge variant="default" className="bg-yellow-400 text-yellow-900 gap-1"><Zap className="w-3.5 h-3.5" /> Featured</Badge>}
                                  {item.brand && <Badge variant="secondary" className="text-sm">{item.brand}</Badge>}
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            <h2 className="font-semibold text-xl mb-2 mt-4">Description</h2>
                            <p className="text-base leading-relaxed text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>

                     {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-xl">Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-muted-foreground font-medium mb-2">{item.locality}</p>
                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                <p className="text-muted-foreground">Map snippet for {item.locality}</p>
                            </div>
                        </CardContent>
                    </Card>

                </div>
                
                {/* Right Column: Seller and Actions */}
                <div className="md:col-span-1 space-y-6">
                    <div className="md:sticky md:top-6 space-y-6">
                        
                         {/* Trust Center (Seller Card) */}
                        {seller && (
                             <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="font-headline text-xl">The Trust Center</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="flex items-center gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={seller.photoURL ?? undefined} alt={seller.displayName} />
                                            <AvatarFallback>{seller.displayName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-0.5">
                                            <p className="font-semibold text-lg">{seller.displayName}</p>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span>{seller.averageRating?.toFixed(1) ?? 0} ({seller.ratingsCount ?? 0} reviews)</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">Joined {format(seller.createdAt?.toDate ? seller.createdAt.toDate() : new Date(), "MMMM yyyy")}</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-4">
                                       <TrustBadge icon={ShieldCheck}>ID Verified</TrustBadge>
                                       <TrustBadge icon={Award}>8+ Items Recycled</TrustBadge>
                                       <TrustBadge icon={Zap}>Quick Responder</TrustBadge>
                                    </div>
                                </CardContent>
                                <Button variant="ghost" className="w-full rounded-t-none border-t" asChild>
                                    <Link href={`/users/${seller.id}`}>
                                        View Full Profile <ChevronRight className="w-4 h-4 ml-auto" />
                                    </Link>
                                </Button>
                            </Card>
                        )}
                        
                        {/* Action Block */}
                        <Card>
                            <CardContent className="p-4 space-y-3">
                                {seller?.isTrusted && item.listingType !== 'Donate' ? (
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
                        <div className="space-y-3 text-sm">
                            <Alert>
                                <AlertDescription>
                                    Safety Tip: Always meet in a public place and inspect the item before you pay. Never transfer money without verifying the product.
                                </AlertDescription>
                            </Alert>
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
        </div>
    );
}


export default function ItemDetailPage({ params }: { params: { id: string } }) {
    return <ItemDetailContent itemId={params.id} />;
}
