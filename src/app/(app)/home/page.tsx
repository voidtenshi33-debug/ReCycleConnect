
"use client"

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ItemCard } from '@/components/item-card';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { categories as appCategories, items as mockItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronRight, Search } from 'lucide-react';
import { CategoryScroller } from '@/components/category-scroller';
import { useFirebase, useUser } from '@/firebase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { Item } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { T } from '@/components/t';
import { useSearchParams } from 'next/navigation';
import { useMemoFirebase } from '@/firebase/provider';


const ItemCarousel = ({ title, items, link = "#" }: { title: React.ReactNode, items: Item[], link?: string }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-headline font-semibold">{title}</h2>
      <Button variant="link" asChild>
        <Link href={link}>
          <T>See All</T> <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
     <Carousel
      opts={{
        align: "start",
        dragFree: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2">
        {items.map((item) => (
          <CarouselItem key={item.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <ItemCard item={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex"/>
    </Carousel>
  </div>
)

const HeroSection = () => (
  <div className="relative w-full h-80 rounded-2xl overflow-hidden mb-8">
    <Image 
      src="https://www.genoxtech.com/UserFiles/kindeditor/image/20240627/627-1.jpg"
      alt="A pile of discarded electronic devices representing e-waste"
      fill
      className="object-cover"
      data-ai-hint="e-waste pile"
    />
    <div className="absolute inset-0 bg-black/50" />
    <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4 space-y-4">
      <h1 className="text-4xl md:text-5xl font-headline font-bold"><T>Give Your Electronics a Second Life.</T></h1>
      <p className="max-w-2xl text-lg text-white/90"><T>The dedicated marketplace for e-waste. Buy, sell, or donate used gadgets and reduce your carbon footprint.</T></p>
      <Button size="lg" asChild>
        <Link href="/post-item">
          <PlusCircle className="mr-2" /> <T>Post Your E-Waste Item</T>
        </Link>
      </Button>
    </div>
  </div>
)


function HomePageContent() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentItems, setCurrentItems] = useState<Item[]>([]);

  const itemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'items');
  }, [firestore]);

  const { data: allItems, isLoading: areItemsLoading } = useCollection<Item>(itemsQuery);

  const displayedItems = useMemo(() => {
    const liveItems = allItems || [];
    // Create a Set of live item IDs for quick lookup
    const liveItemIds = new Set(liveItems.map(item => item.id));
    // Filter mockItems to exclude any that have a matching ID in liveItems
    const filteredMockItems = mockItems.filter(item => !liveItemIds.has(item.id));
    // Combine live items with the filtered mock items
    return [...liveItems, ...filteredMockItems];
  }, [allItems]);


  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl) {
      setSearchQuery(queryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = displayedItems;
    // @ts-ignore - user has no lastKnownLocality
    const userLocation = user?.lastKnownLocality;

    if (userLocation && !isUserLoading) {
        // This is a mock implementation. For a real app, you would query based on location.
        // filtered = filtered.filter((item) => item.locality === userLocation);
    }
    
    if (activeCategory !== 'all') {
      const categoryName = appCategories.find(c => c.slug === activeCategory)?.name;
      if (categoryName) {
        filtered = filtered.filter(item => item.category.toLowerCase() === categoryName.toLowerCase());
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locality.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setCurrentItems(filtered);
  }, [user, isUserLoading, activeCategory, searchQuery, displayedItems]);

  const { featuredItems, donationItems } = useMemo(() => {
    if (!displayedItems) return { featuredItems: [], donationItems: [] };
    const featured = displayedItems.filter(item => item.isFeatured);
    const donations = displayedItems.filter(item => item.listingType === 'Donate');

    return {
      featuredItems: featured,
      donationItems: donations,
    };
  }, [displayedItems]);

  const handleCategorySelect = (categorySlug: string) => {
    setActiveCategory(categorySlug);
  };

  const getHeading = () => {
    if (activeCategory === 'all') {
      return <T>Fresh Recommendations</T>;
    }
    const category = appCategories.find(c => c.slug === activeCategory);
    return category ? <T>{category.name}</T> : <T>Listings</T>;
  };

  return (
    <>
      <HeroSection />
      
      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-headline font-semibold mb-4"><T>Browse by E-Waste Category</T></h2>
          <CategoryScroller onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for electronics or locations..."
            className="pl-10 w-full md:w-1/2 lg:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeCategory === 'all' && searchQuery.length === 0 && featuredItems.length > 0 && (
          <ItemCarousel title={<T>⭐ Featured Electronics</T>} items={featuredItems} />
        )}
        
        {activeCategory === 'all' && searchQuery.length === 0 && donationItems.length > 0 && (
           <ItemCarousel title={<T>♻️ E-Waste Donations Corner</T>} items={donationItems} />
        )}

        <div>
           <h2 className="text-2xl font-headline font-semibold mb-4">
             {searchQuery ? <T>Search Results</T> : getHeading()}
          </h2>
          {areItemsLoading ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
                <p><T>Loading items...</T></p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {currentItems.length > 0 ? (
                currentItems.map(item => (
                    <ItemCard key={item.id} item={item} />
                ))
                ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                    <p><T>No electronic items found.</T></p>
                </div>
                )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
