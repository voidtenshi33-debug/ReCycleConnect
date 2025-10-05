
"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from './ui/scroll-area';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Loader2, MapPin } from 'lucide-react';
import { locations } from '@/lib/data';
import { useFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { handleGetLocality } from '@/app/actions';

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
                 errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: userRef.path,
                    operation: 'update',
                    requestResourceData: { lastKnownLocality: localitySlug },
                }));
            });
    }

    const handleDetectLocation = () => {
        setIsDetecting(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const result = await handleGetLocality(latitude, longitude);

                if (result.error) {
                    setError(result.error);
                    setIsDetecting(false);
                    return;
                }
                
                if (result.locality) {
                    // Check if the returned locality slug exists in our predefined list
                    const matchedLocation = locations.find(l => l.slug === result.locality);
                    if (matchedLocation) {
                        handleLocationSelect(matchedLocation.slug);
                    } else {
                        setError(`Could not find a matching locality for "${result.locality}". Please select one manually.`);
                    }
                } else {
                    setError("Could not determine your locality. Please select one manually.");
                }

                setIsDetecting(false);
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
