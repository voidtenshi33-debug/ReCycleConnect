
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection, useDoc, useFirebase, useUser } from "@/firebase";
import type { User, Item } from "@/lib/types";
import { Star, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { collection, doc, query, where, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { useMemoFirebase } from "@/firebase/provider";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemCard } from "@/components/item-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';


function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="flex-grow space-y-2">
                           <Skeleton className="h-8 w-48" />
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-5 w-24" />
                        </div>
                        <Skeleton className="h-10 w-24 rounded-md" />
                    </div>
                </CardHeader>
            </Card>
             <Tabs defaultValue="listings">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="listings">Active Listings</TabsTrigger>
                    <TabsTrigger value="ratings">Ratings</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                 <TabsContent value="listings">
                     <Card>
                        <CardHeader>
                            <CardTitle>Your Listings</CardTitle>
                            <CardDescription>Manage your active item listings.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground py-12">
                           <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                           <p className="mt-2">Loading your listings...</p>
                        </CardContent>
                    </Card>
                 </TabsContent>
            </Tabs>
        </div>
    )
}


export default function ProfilePage() {
    const { firestore } = useFirebase();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();

    const [itemToRemove, setItemToRemove] = useState<string | null>(null);

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<User>(userProfileRef);

    const userListingsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(collection(firestore, 'items'), where('ownerId', '==', user.uid));
    }, [firestore, user?.uid]);

    const { data: userItems, isLoading: areItemsLoading } = useCollection<Item>(userListingsQuery);

    const handleConfirmRemove = async () => {
        if (!itemToRemove || !firestore) return;

        const itemRef = doc(firestore, 'items', itemToRemove);
        
        try {
            // Using non-blocking delete for better UI responsiveness
            deleteDocumentNonBlocking(itemRef);

            toast({
                title: "Item Removed",
                description: "Your listing has been successfully removed.",
            });
        } catch (error: any) {
            console.error("Error removing item:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: `Could not remove the item. ${error.message}`,
            });
        } finally {
            setItemToRemove(null);
        }
    };


    if (isUserLoading || isProfileLoading || !userProfile) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={userProfile.photoURL ?? undefined} alt={userProfile.displayName} />
                            <AvatarFallback>{(userProfile.displayName || 'U').charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <CardTitle className="font-headline text-2xl md:text-3xl">{userProfile.displayName}</CardTitle>
                            <CardDescription className="mt-1">
                                Member since {format(userProfile.createdAt?.toDate ? userProfile.createdAt.toDate() : new Date(), "MMMM yyyy")}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span>{userProfile.averageRating?.toFixed(1) ?? 0} ({userProfile.ratingsCount ?? 0} reviews)</span>
                                </div>
                            </div>
                        </div>
                        <Button>Edit Profile</Button>
                    </div>
                </CardHeader>
            </Card>

            <Tabs defaultValue="listings">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="listings">Active Listings</TabsTrigger>
                    <TabsTrigger value="ratings">Ratings</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="listings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Listings</CardTitle>
                            <CardDescription>Manage your active item listings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {areItemsLoading ? (
                                <div className="text-center text-muted-foreground py-12">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    <p className="mt-2">Loading your listings...</p>
                                </div>
                            ) : userItems && userItems.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                                    {userItems.map(item => (
                                        <ItemCard 
                                            key={item.id} 
                                            item={item} 
                                            showControls 
                                            onRemove={() => setItemToRemove(item.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-12">
                                    <p>You have no active listings.</p>
                                    <Button variant="link" className="mt-2" asChild>
                                        <Link href="/post-item">Post an item</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="ratings">
                     <Card>
                        <CardHeader>
                            <CardTitle>Ratings Received</CardTitle>
                            <CardDescription>Feedback from other users.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground py-12">
                            <p>You have not received any ratings yet.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Manage your account settings and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="grid gap-2 max-w-md">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={userProfile.displayName} />
                            </div>
                             <div className="grid gap-2 max-w-md">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" defaultValue={userProfile.lastKnownLocality} />
                            </div>
                             <Separator />
                             <div className="grid gap-2 max-w-md">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={userProfile.email} disabled />
                                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                            </div>
                            <div className="grid gap-2 max-w-md">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" defaultValue={userProfile.phoneNumber || ''} placeholder="Add your phone number" />
                            </div>
                            <Button>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to remove this listing?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the item
                        listing from ReCycleConnect.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Yes, Remove Listing
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

    
