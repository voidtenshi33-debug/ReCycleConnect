

"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MultiImageUpload } from '@/components/multi-image-upload';
import { categories as appCategories, locations, users as mockUsers } from '@/lib/data';
import type { Item, ItemCondition } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';
import { useFirebase, useUser } from '@/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { PriceSlider } from './price-slider';
import { handleGenerateDescription } from '@/app/actions';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

const conditionOptions: ItemCondition[] = [
    "Like New",
    "Good",
    "Working",
    "Needs Minor Repair",
    "Needs Major Repair",
    "For Spare Parts Only",
    "Not Working"
];


export function PostItemForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { firestore } = useFirebase();
    const { user, isUserLoading } = useUser();

    // State from AI Valuator (via URL params)
    const [initialTitle, setInitialTitle] = useState('');
    const [initialCategory, setInitialCategory] = useState('');
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    
    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [condition, setCondition] = useState<ItemCondition>("Working");
    const [price, setPrice] = useState<number | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);


    useEffect(() => {
        const urlTitle = searchParams.get('title');
        const urlCategory = searchParams.get('category');
        const urlMinPrice = searchParams.get('minPrice');
        const urlMaxPrice = searchParams.get('maxPrice');

        if (urlTitle) {
            setInitialTitle(urlTitle);
            setTitle(urlTitle);
        }
        if (urlCategory) {
            setInitialCategory(urlCategory);
            setSelectedCategory(urlCategory);
        }
        if (urlMinPrice && urlMaxPrice) {
            const minP = parseInt(urlMinPrice);
            const maxP = parseInt(urlMaxPrice);
            setMinPrice(minP);
            setMaxPrice(maxP);
            // Set default price to the midpoint
            setPrice(Math.round((minP + maxP) / 2));
        }
    }, [searchParams]);

    const handleGenerateDescriptionClick = async () => {
        if (images.length === 0) {
            toast({
                title: "Upload an Image First",
                description: "Please upload at least one image of your item before generating a description.",
                variant: "destructive"
            });
            return;
        }

        setIsGeneratingDescription(true);
        const result = await handleGenerateDescription(images);
        if (result.description) {
            setDescription(result.description);
            toast({
                title: "Description Generated!",
                description: "The AI has written a description for your item.",
            });
        } else if (result.error) {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            });
        }
        setIsGeneratingDescription(false);
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

        if (images.length === 0) {
            toast({
                title: "Image Required",
                description: "Please upload at least one image for your electronic item.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        
        const finalPrice = Number(price) || 0;
        
        const ownerProfile = mockUsers.find(u => u.userId === user.uid) || { displayName: user.displayName, photoURL: user.photoURL, averageRating: 0 };

        try {
            // In a real app, images would be uploaded to a storage service like Firebase Storage,
            // and you would get back URLs. For this prototype, we'll store the data URIs directly.
            const imageUrls = images; 

            const newItem: Omit<Item, 'id'> = {
                title: formData.get('title') as string,
                description: description,
                imageUrls: imageUrls,
                category: selectedCategory,
                brand: formData.get('brand') as string,
                condition: condition,
                listingType: finalPrice === 0 ? "Donate" : "Sell",
                price: finalPrice,
                locality: formData.get('locality') as string,
                createdAt: serverTimestamp(),
                ownerId: user.uid,
                ownerName: ownerProfile.displayName ?? user.displayName ?? "Anonymous",
                ownerAvatarUrl: ownerProfile.photoURL ?? user.photoURL,
                ownerRating: ownerProfile.averageRating,
                status: 'Available',
                isFeatured: false,
            };

            if (!firestore) throw new Error("Firestore is not initialized.");

            const itemsCollectionRef = collection(firestore, 'items');
            await addDoc(itemsCollectionRef, newItem);

            toast({
                title: "Listing Submitted!",
                description: "Your electronic item is now live on ReCycleConnect.",
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
        <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="title">Item Title</Label>
                    <Input id="title" name="title" placeholder="e.g., MacBook Pro 14-inch" required defaultValue={title || initialTitle} onChange={e => setTitle(e.target.value)} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" placeholder="e.g., Apple, Samsung" />
                </div>
            </div>

            <div className="grid gap-2">
                 <Label>Item Images (up to 3)</Label>
                 <MultiImageUpload images={images} setImages={setImages} />
            </div>

            <div className="grid gap-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="description">Description</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescriptionClick} disabled={isGeneratingDescription || images.length === 0}>
                        {isGeneratingDescription ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        AI Generate
                    </Button>
                </div>
                <Textarea id="description" name="description" placeholder="Describe your item's condition, features, and any issues." required value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" value={selectedCategory} onValueChange={setSelectedCategory} required>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {appCategories.map(cat => <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label>Condition</Label>
                <RadioGroup 
                    value={condition} 
                    onValueChange={(value: ItemCondition) => setCondition(value)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
                >
                    {conditionOptions.map(cond => (
                         <Label 
                            key={cond}
                            htmlFor={cond}
                            className={cn(
                                "flex items-center space-x-3 rounded-md border-2 p-4 cursor-pointer transition-all",
                                condition === cond ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                            )}
                        >
                            <RadioGroupItem value={cond} id={cond} />
                            <span className="font-medium">{cond}</span>
                        </Label>
                    ))}
                </RadioGroup>
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
                    {minPrice !== null && maxPrice !== null && typeof price === 'number' ? (
                        <PriceSlider
                            min={minPrice}
                            max={maxPrice}
                            value={price}
                            onValueChange={(newPrice) => setPrice(newPrice)}
                        />
                    ) : (
                        <div>
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input 
                                id="price" 
                                name="price" 
                                type="number" 
                                placeholder="Enter 0 for a free donation"
                                value={price}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPrice(val === '' ? '' : parseInt(val, 10));
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto justify-self-end" disabled={isSubmitting || isUserLoading}>
               {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
               {isSubmitting ? 'Posting...' : 'Post Item'}
            </Button>
        </form>
    );
}
