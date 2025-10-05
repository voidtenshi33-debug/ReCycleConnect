
"use client"

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ItemCard } from '@/components/item-card';
import { items as allItems, locations, users, categories as appCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronRight, Search } from 'lucide-react';
import { CategoryScroller } from '@/components/category-scroller';
import { useUser } from '@/firebase';
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
      src="https://images.unsplash.com/photo-1528328154642-f1c521f7c32d?q=80&w=2070&auto=format&fit=crop"
      alt="Electronics recycling background"
      fill
      className="object-cover"
      data-ai-hint="electronics recycling"
    />
    <div className="absolute inset-0 bg-black/50" />
    <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4 space-y-4">
      <h1 className="text-4xl md:text-5xl font-headline font-bold"><T>Give Your Electronics a Second Life.</T></h1>
      <p className="max-w-2xl text-lg text-white/90"><T>Join the community in reducing e-waste. Buy, sell, or donate your used gadgets today.</T></p>
      <Button size="lg" asChild>
        <Link href="/post-item">
          <PlusCircle className="mr-2" /> <T>Post Your Item Now</T>
        </Link>
      </Button>
    </div>
  </div>
)


export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentItems, setCurrentItems] = useState<Item[]>(allItems);

  useEffect(() => {
    let filtered = allItems;
    // @ts-ignore - user has no lastKnownLocality
    const userLocation = user?.lastKnownLocality;

    if (userLocation && !isUserLoading) {
        filtered = filtered.filter((item) => item.locality === userLocation);
    }
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.locality.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setCurrentItems(filtered);
  }, [user, isUserLoading, activeCategory, searchQuery]);

  const { featuredItems, donationItems, recentItems } = useMemo(() => {
    const featured = currentItems.filter(item => item.isFeatured);
    const donations = currentItems.filter(item => item.listingType === 'Donate');
    const recents = currentItems.filter(item => !item.isFeatured && item.listingType !== 'Donate');

    return {
      featuredItems: featured,
      donationItems: donations,
      recentItems: recents
    };
  }, [currentItems]);

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
          <h2 className="text-2xl font-headline font-semibold mb-4"><T>Browse by Category</T></h2>
          <CategoryScroller onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by product or location..."
            className="pl-10 w-full md:w-1/2 lg:w-1/3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {activeCategory === 'all' && searchQuery.length === 0 && featuredItems.length > 0 && (
          <ItemCarousel title={<T>⭐ Featured Items</T>} items={featuredItems} />
        )}
        
        {activeCategory === 'all' && searchQuery.length === 0 && donationItems.length > 0 && (
           <ItemCarousel title={<T>♻️ Donations Corner</T>} items={donationItems} />
        )}

        <div>
           <h2 className="text-2xl font-headline font-semibold mb-4">
             {searchQuery ? <T>Search Results</T> : getHeading()}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p><T>No items found.</T></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

