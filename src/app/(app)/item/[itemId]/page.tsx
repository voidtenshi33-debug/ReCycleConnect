
'use client';

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Flag, MessageSquare, Share2, Star, ShieldCheck, Award, Zap, CheckCircle, Wrench, XCircle, Loader2, CreditCard, Puzzle, Bot, Clock, Eye, Heart } from "lucide-react";
import { format } from "date-fns";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDoc, useFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Item, User } from "@/lib/types";
import { useMemoFirebase } from "@/firebase/provider";
import { CompatibilityChecker } from "@/components/compatibility-checker";
import { T } from "@/components/t";

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

    const itemRef = useMemoFirebase(() => (firestore && itemId) ? doc(firestore, 'items', itemId) : null, [firestore, itemId]);
    const { data: item, isLoading: isItemLoading } = useDoc<Item>(itemRef);
    
    const sellerId = item?.ownerId;
    const sellerRef = useMemoFirebase(() => (firestore && sellerId) ? doc(firestore, 'users', sellerId) : null, [firestore, sellerId]);
    const { data: seller, isLoading: isSellerLoading } = useDoc<User>(sellerRef);

    const isComponent = item && ['Components', 'Gaming', 'Keyboards'].includes(item.category);

    if (isItemLoading || isSellerLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!item || !seller) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
             <Link href="/home" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                <T>Back to listings</T>
            </Link>

            <div className="flex flex-col gap-8">
                
                {/* Section 1: Title & Trust */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="text-sm"><T>{item.category}</T></Badge>
                            <Badge variant="outline" className="text-sm flex items-center gap-1">
                                {getConditionIcon(item.condition)}
                                <T>{item.condition}</T>
                            </Badge>
                             {item.isFeatured && <Badge variant="default" className="bg-yellow-400 text-yellow-900 gap-1"><Zap className="w-3.5 h-3.5" /> <T>Featured</T></Badge>}
                             {seller.isTrusted && <Badge variant="default" className="gap-1"><ShieldCheck className="w-3.5 h-3.5" /> <T>Verified Seller</T></Badge>}
                        </div>
                        <CardTitle className="font-headline text-3xl md:text-4xl font-bold pt-2"><T>{item.title}</T></CardTitle>
                    </CardHeader>
                    <Separator />
                     <CardContent className="pt-4">
                        <Link href={`/users/${seller.id}`} className="block hover:bg-muted -m-4 p-4 rounded-lg">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={seller.photoURL ?? undefined} alt={seller.displayName} />
                                    <AvatarFallback>{seller.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5 flex-grow">
                                    <p className="font-semibold text-lg"><T>{seller.displayName}</T></p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{seller.averageRating?.toFixed(1) ?? 0} ({seller.ratingsCount ?? 0} <T>reviews</T>)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                       {seller.isTrusted && <TrustBadge icon={ShieldCheck}><T>ID Verified</T></TrustBadge>}
                                       <TrustBadge icon={Award}><T>8+ Items Recycled</T></TrustBadge>
                                       <TrustBadge icon={Zap}><T>Quick Responder</T></TrustBadge>
                                    </div>
                                </div>
                                 <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                            </div>
                        </Link>
                    </CardContent>
                </Card>

                {/* Section 2: Image Gallery */}
                <Carousel className="w-full">
                    <CarouselContent>
                        {item.imageUrls.map((img, index) => (
                        <CarouselItem key={index}>
                            <Card className="overflow-hidden">
                                <div className="relative aspect-video w-full">
                                    <Image src={img} alt={`${item.title} image ${index + 1}`} fill className="object-cover" data-ai-hint="product photo" />
                                </div>
                            </Card>
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
                
                {/* Section 3 & 4: AI Snapshot & Description */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">
                           <T>Details</T>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* AI Product Snapshot Placeholder */}
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                             <div className="flex items-center gap-2 font-semibold">
                                <Bot className="w-5 h-5 text-primary" />
                                <span><T>Product Snapshot by ReCycleConnect AI</T></span>
                             </div>
                             <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground"><T>Model:</T></span> Sony WH-1000XM4</p>
                             <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground"><T>Key Specs:</T></span> <T>Industry-leading noise cancellation, 30-hour battery life...</T></p>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium text-foreground"><T>AI Longevity Forecast:</T></span>
                                <T>1-2 more years</T>
                             </div>
                        </div>

                        {/* Seller's Description */}
                        <div>
                             <h3 className="font-semibold text-lg mb-2"><T>Seller's Description</T></h3>
                             <p className="text-base leading-relaxed text-muted-foreground"><T>{item.description}</T></p>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 5 & 6: Community Metrics & Meetup Zone */}
                <Card>
                     <CardHeader>
                        <CardTitle className="font-headline text-2xl">
                           <T>Community & Location</T>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         {/* Community Metrics Placeholder */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> <span><T>Added to 12 wishlists</T></span></div>
                            <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> <span><T>Viewed 58 times today</T></span></div>
                        </div>
                        <Separator />
                         {/* Meetup Zone */}
                        <div>
                            <h3 className="font-semibold text-lg mb-2"><T>Meetup Zone in</T> {item.locality}</h3>
                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                <p className="text-muted-foreground"><T>Interactive Map showing RecycleConnect Safe Spots near</T> {item.locality}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                 {/* Section 7: Sticky Action Bar */}
                 <div className="sticky bottom-4 z-10 w-full">
                     <Card className="shadow-2xl max-w-lg mx-auto">
                        <CardContent className="p-3">
                             {isComponent && <CompatibilityChecker item={item} />}
                            <div className="flex gap-3 mt-3">
                                {seller?.isTrusted && item.listingType !== 'Donate' ? (
                                    <>
                                        <Button size="lg" className="flex-1 font-bold">
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            <T>Buy Now</T> - ₹{item.price.toLocaleString()}
                                        </Button>
                                        <Button size="lg" variant="outline" className="flex-1">
                                            <MessageSquare className="mr-2 h-5 w-5"/> <T>Message Seller</T>
                                        </Button>
                                    </>
                                ) : (
                                    <Button size="lg" className="w-full font-bold">
                                        <MessageSquare className="mr-2 h-5 w-5"/>
                                        {item.listingType === 'Donate' ? <T>Request Donation</T> : <T>Message Seller</T>}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                 </div>

            </div>
        </div>
    );
}

export default function ItemDetailPage({ params }: { params: { itemId: string } }) {
    return <ItemDetailContent itemId={params.itemId} />;
}

    