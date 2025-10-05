
"use client"

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ItemCard } from '@/components/item-card';
import { items as allItems, locations, users, categories as appCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, PlusCircle } from 'lucide-react';
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


const ItemCarousel = ({ title, items, link = "#" }: { title: string, items: Item[], link?: string }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-headline font-semibold">{title}</h2>
      <Button variant="link" asChild>
        <Link href={link}>
          See All <ChevronRight className="h-4 w-4" />
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
      <h1 className="text-4xl md:text-5xl font-headline font-bold">Give Your Electronics a Second Life.</h1>
      <p className="max-w-2xl text-lg text-white/90">Join the community in reducing e-waste. Buy, sell, or donate your used gadgets today.</p>
      <Button size="lg" asChild>
        <Link href="/post-item">
          <PlusCircle className="mr-2" /> Post Your Item Now
        </Link>
      </Button>
    </div>
  </div>
)


export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const handleCategorySelect = (categorySlug: string) => {
    setActiveCategory(categorySlug);
  };
  
  const { featuredItems, donationItems, recentItems } = useMemo(() => {
    let currentItems = allItems;
    // @ts-ignore - user has no lastKnownLocality
    const userLocation = user?.lastKnownLocality;

    if (userLocation && !isUserLoading) {
      currentItems = allItems.filter((item) => item.locality === userLocation);
    }
    
    if (activeCategory !== 'all') {
      currentItems = currentItems.filter(item => item.category === activeCategory);
    }

    const featured = currentItems.filter(item => item.isFeatured);
    const donations = currentItems.filter(item => item.listingType === 'Donate');
    const recents = currentItems.filter(item => !item.isFeatured && item.listingType !== 'Donate');

    return {
      featuredItems: featured,
      donationItems: donations,
      recentItems: recents
    };

  }, [user, isUserLoading, activeCategory]);

  return (
    <>
      <HeroSection />
      
      <div className="space-y-12">
        <div>
          <h2 className="text-2xl font-headline font-semibold mb-4">Browse by Category</h2>
          <CategoryScroller onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
        </div>

        {activeCategory === 'all' && featuredItems.length > 0 && (
          <ItemCarousel title="⭐ Featured Items" items={featuredItems} />
        )}
        
        {activeCategory === 'all' && donationItems.length > 0 && (
           <ItemCarousel title="♻️ Donations Corner" items={donationItems} />
        )}

        <div>
           <h2 className="text-2xl font-headline font-semibold mb-4">
             {activeCategory === 'all' ? 'Fresh Recommendations' : `${appCategories.find(c => c.slug === activeCategory)?.name || 'Listings'}`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {recentItems.length > 0 ? (
              recentItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No items found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
