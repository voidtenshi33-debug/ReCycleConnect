
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ImageUploadWithAI } from '@/components/image-upload-with-ai';
import { itemCategories, locations, users as mockUsers } from '@/lib/data';
import type { Item, ItemCondition } from '@/lib/types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirebase, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function PostItemPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { user, isUserLoading } = useUser();

    const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [imageDataUri, setImageDataUri] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCategoriesSuggested = (categories: string[]) => {
        setSuggestedCategories(categories);
        if (categories.length > 0) {
            setSelectedCategory(categories[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "You must be logged in to post an item.",
                variant: "destructive",
            });
            return;
        }

        if (!imageDataUri) {
            toast({
                title: "Image Required",
                description: "Please upload an image for your item.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData.entries());

        const price = Number(formValues.price) || 0;
        
        // Find mock user data for owner fields - in a real app, this might come from a user profile hook
        const ownerProfile = mockUsers.find(u => u.userId === user.uid) || { ownerName: user.displayName, ownerAvatarUrl: user.photoURL, ownerRating: 0 };


        try {
            const newItem: Omit<Item, 'id'> = {
                title: formValues.title as string,
                description: formValues.description as string,
                imageUrls: [imageDataUri], // In a real app, you'd upload the file and get a URL
                category: formValues.category as string,
                condition: formValues.condition as ItemCondition,
                listingType: price === 0 ? "Donate" : "Sell",
                price: price,
                locality: formValues.locality as string,
                createdAt: serverTimestamp(),
                ownerId: user.uid,
                ownerName: ownerProfile.displayName,
                ownerAvatarUrl: ownerProfile.photoURL,
                ownerRating: ownerProfile.averageRating,
                status: 'Available',
                isFeatured: false,
            };

            const itemsCollectionRef = collection(firestore, 'items');
            await addDoc(itemsCollectionRef, newItem);

            toast({
                title: "Listing Submitted!",
                description: "Your item is now live on ReCycleConnect.",
            });

            router.push('/home');

        } catch (error: any) {
            console.error("Error posting item:", error);
            toast({
                title: "Submission Failed",
                description: error.message || "There was an error posting your item. Please try again.",
                variant: "destructive",
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/home" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to listings
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">List an Item</CardTitle>
                    <CardDescription>Fill out the details below to post your electronic item.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-6" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Item Title</Label>
                            <Input id="title" name="title" placeholder="e.g., MacBook Pro 14-inch" required />
                        </div>

                        <div className="grid gap-2">
                            <Label>Item Image</Label>
                            <ImageUploadWithAI 
                                onCategoriesSuggested={handleCategoriesSuggested}
                                onImageSelected={setImageDataUri}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            {suggestedCategories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <p className="text-sm text-muted-foreground w-full">AI Suggestions:</p>
                                    {suggestedCategories.map(cat => (
                                        <Button key={cat} type="button" variant={selectedCategory === cat ? "default" : "secondary"} size="sm" onClick={() => setSelectedCategory(cat)}>
                                            {cat}
                                        </Button>
                                    ))}
                                </div>
                            )}
                            <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory} required>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {itemCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Condition</Label>
                            <RadioGroup name="condition" defaultValue="Working" className="flex flex-col sm:flex-row gap-4 pt-2">
                                {(["Working", "Needs Minor Repair", "For Spare Parts Only"] as ItemCondition[]).map(cond => (
                                    <div key={cond} className="flex items-center space-x-2">
                                        <RadioGroupItem value={cond} id={cond} />
                                        <Label htmlFor={cond}>{cond}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Describe your item's condition, features, and any issues." required />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="locality">Location</Label>
                                 <Select name="locality" required>
                                    <SelectTrigger id="locality">
                                        <SelectValue placeholder="Select your locality" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map(loc => <SelectItem key={loc.slug} value={loc.slug}>{loc.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input id="price" name="price" type="number" placeholder="Enter 0 for free items" />
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full sm:w-auto justify-self-end" disabled={isSubmitting || isUserLoading}>
                           {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                           {isSubmitting ? 'Posting...' : 'Post Item'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
