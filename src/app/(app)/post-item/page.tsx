
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
import { itemCategories, locations } from '@/lib/data';
import type { ItemCondition } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PostItemPage() {
    const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [imageDataUri, setImageDataUri] = useState<string>("");

    const handleCategoriesSuggested = (categories: string[]) => {
        setSuggestedCategories(categories);
        if (categories.length > 0) {
            setSelectedCategory(categories[0]);
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
                    <form className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Item Title</Label>
                            <Input id="title" placeholder="e.g., MacBook Pro 14-inch" />
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
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                            <RadioGroup defaultValue="working" className="flex flex-col sm:flex-row gap-4 pt-2">
                                {(["Working", "Needs Minor Repair", "For Spare Parts Only"] as ItemCondition[]).map(cond => (
                                    <div key={cond} className="flex items-center space-x-2">
                                        <RadioGroupItem value={cond.toLowerCase().replace(/ /g, '-')} id={cond} />
                                        <Label htmlFor={cond}>{cond}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe your item's condition, features, and any issues." />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="locality">Location</Label>
                                 <Select required>
                                    <SelectTrigger id="locality">
                                        <SelectValue placeholder="Select your locality" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map(loc => <SelectItem key={loc.slug} value={loc.slug}>{loc.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input id="price" type="number" placeholder="Enter 0 for free items" />
                            </div>
                        </div>

                        <Button type="submit" size="lg" className="w-full sm:w-auto justify-self-end">Post Item</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
