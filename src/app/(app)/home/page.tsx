
"use client"

import { ItemCard } from '@/components/item-card';
import { items, locations } from '@/lib/data';
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
import { useMemo } from 'react';

export default function HomePage() {
  const { user, isUserLoading } = useUser();

  // In a real app, this would be a Firestore query.
  // We're filtering the mock data for now.
  const filteredItems = useMemo(() => {
    // @ts-ignore - user has no lastKnownLocality
    const userLocation = user?.lastKnownLocality;
    if (!userLocation || isUserLoading) {
      // Return all items if no location or still loading
      // Or maybe show a loader/message
      return items;
    }
    // A real app would also query based on the selected location.
    // For now we mock it by filtering.
    const locationData = locations.find(l => l.slug === userLocation);
    if (!locationData) return items;

    // A bit of a hack to make the mock data seem location-aware
    return items.filter((item, index) => {
        const locIndex = locations.findIndex(l => l.name === item.location);
        return locIndex !== -1 && locIndex % locations.length === locations.indexOf(locationData);
    });
  }, [user, isUserLoading]);


  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold">Explore Categories</h1>
      </div>
      <CategoryScroller />
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-2xl font-headline font-semibold">Featured Items</h1>
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
