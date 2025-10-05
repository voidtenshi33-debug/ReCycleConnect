
"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from './ui/scroll-area';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Loader2, MapPin } from 'lucide-react';
import { locations } from '@/lib/data';
import { useFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface LocationModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function LocationModal({ isOpen, setIsOpen }: LocationModalProps) {
    const { firestore, user } = useFirebase();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDetecting, setIsDetecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filteredLocations = locations.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLocationSelect = (localitySlug: string) => {
        if (!user || !firestore) return;
        const userRef = doc(firestore, 'users', user.uid);
        setDoc(userRef, { lastKnownLocality: localitySlug }, { merge: true })
            .then(() => setIsOpen(false))
            .catch(err => {
                console.error("Failed to save location", err);
                setError("Could not save your location preference.");
            });
    }

    const handleDetectLocation = () => {
        setIsDetecting(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In a real app, you would use a reverse geocoding service here.
                // For this demo, we'll just pick a random popular location.
                console.log(position.coords.latitude, position.coords.longitude);
                setTimeout(() => {
                    handleLocationSelect('hinjawadi'); // Mocking detection to Hinjawadi
                    setIsDetecting(false);
                }, 1000);
            },
            (err) => {
                if (err.code === 1) { // PERMISSION_DENIED
                    setError("Location blocked. Check browser/phone settings.");
                } else {
                    setError("Could not detect your location.");
                }
                setIsDetecting(false);
            },
            { timeout: 10000 }
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-headline">Select Location</DialogTitle>
                    <DialogDescription>
                        Choose your locality to see relevant listings.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder="Search for a locality..." value={searchQuery} onValueChange={setSearchQuery} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Popular Locations">
                                <ScrollArea className="h-[200px]">
                                {filteredLocations.map(loc => (
                                    <CommandItem key={loc.slug} onSelect={() => handleLocationSelect(loc.slug)} className="cursor-pointer">
                                        {loc.name}
                                    </CommandItem>
                                ))}
                                </ScrollArea>
                            </CommandGroup>
                        </CommandList>
                    </Command>

                    <Button className="w-full" onClick={handleDetectLocation} disabled={isDetecting}>
                        {isDetecting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <MapPin className="mr-2 h-4 w-4" />
                        )}
                        {isDetecting ? 'Detecting your location...' : 'Use current location'}
                    </Button>

                    {error && <p className="text-sm text-center text-destructive">{error}</p>}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// You might need to add these to your components/ui folder if they don't exist
// components/ui/command.tsx
// This is a complex component. For this example, let's assume you've added it
// via `npx shadcn-ui@latest add command`
