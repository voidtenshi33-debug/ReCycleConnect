
"use client"

import { useState, useMemo } from 'react';
import { ItemCard } from '@/components/item-card';
import { items, locations, users, categories as appCategories } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { CategoryScroller } from '@/components/category-scroller';
import { useUser } from '@/firebase';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleCategorySelect = (categorySlug: string) => {
    setActiveCategory(categorySlug);
  };

  const filteredItems = useMemo(() => {
    let currentItems = items;
    // @ts-ignore - user has no lastKnownLocality
    const userLocation = user?.lastKnownLocality;

    if (userLocation && !isUserLoading) {
      currentItems = items.filter((item) => item.locality === userLocation);
    }
    
    if (activeCategory === 'all') {
      return currentItems;
    }

    return currentItems.filter(item => item.category === activeCategory);

  }, [user, isUserLoading, activeCategory]);

  const pageTitle = activeCategory === 'all' 
    ? 'Featured Items' 
    : `${appCategories.find(c => c.slug === activeCategory)?.name || 'Items'}`;

  // @ts-ignore
  const locationName = locations.find(l => l.slug === user?.lastKnownLocality)?.name || '';


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Explore Categories</h1>
      </div>
      <CategoryScroller onCategorySelect={handleCategorySelect} activeCategory={activeCategory} />
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-2xl font-headline font-semibold">
          {pageTitle}
          {locationName && <span className="text-muted-foreground text-xl"> in {locationName.replace(', Pune', '')}</span>}
        </h1>
        <div className="flex items-center gap-2">
          <Select defaultValue="newest">
            <SelectTrigger className="w-auto md:w-[180px] sm:w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="nearest">Nearest First</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-10 gap-1">
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Filter
            </span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
