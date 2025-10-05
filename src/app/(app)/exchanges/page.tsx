
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCollection, useDoc, useFirebase, useMemoFirebase } from "@/firebase"
import type { ExchangeRequest, Item, User } from "@/lib/types"
import { collection, query, where } from "firebase/firestore"
import { Repeat2, ShoppingBag } from "lucide-react"

const RequestCard = ({ request }: { request: ExchangeRequest & { id: string } }) => {
    const { user: currentUser } = useFirebase();
    
    // Determine the other user's ID
    const otherUserId = request.sellerId === currentUser?.uid ? request.requesterId : request.sellerId;

    // Fetch item, other user, and my profile
    const { data: item } = useDoc<Item>(useMemoFirebase(() => doc(useFirebase().firestore, 'items', request.itemId), [request.itemId]));
    const { data: otherUser } = useDoc<User>(useMemoFirebase(() => doc(useFirebase().firestore, 'users', otherUserId), [otherUserId]));
    
    if (!item || !otherUser) {
        // You can return a loading skeleton here
        return (
            <div className="flex items-center justify-between p-4 border-b animate-pulse">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-md bg-muted" />
                    <div>
                        <div className="h-4 w-48 bg-muted rounded" />
                        <div className="h-4 w-32 bg-muted rounded mt-2" />
                    </div>
                </div>
                <div className="h-8 w-24 bg-muted rounded-full" />
            </div>
        );
    }
    
    const isMyRequest = request.requesterId === currentUser?.uid;

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <Image src={item.imageUrls[0]} alt={item.title} width={64} height={64} className="rounded-md object-cover aspect-square" />
                <div>
                    <Link href={`/items/${item.id}`} className="font-semibold hover:underline">{item.title}</Link>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={otherUser.photoURL ?? undefined} />
                            <AvatarFallback>{otherUser.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{otherUser.displayName}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant={request.status === 'Accepted' ? 'default' : request.status === 'Completed' ? 'secondary' : 'outline'}>{request.status}</Badge>
                {request.status === 'Pending' && !isMyRequest && <Button size="sm">Respond</Button>}
                {request.status === 'Completed' && <Button size="sm" variant="outline">Leave Rating</Button>}
            </div>
        </div>
    )
}

const EmptyState = ({ title, description, isMyRequests = false }: { title: string, description: string, isMyRequests?: boolean }) => (
    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
        {isMyRequests ? <ShoppingBag className="h-12 w-12 mb-4" /> : <Repeat2 className="h-12 w-12 mb-4" />}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1">{description}</p>
        {isMyRequests && (
            <Button asChild className="mt-4">
                <Link href="/home">Browse Items</Link>
            </Button>
        )}
    </div>
);


export default function ExchangesPage() {
    const { firestore, user } = useFirebase();

    const incomingRequestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'exchanges'), where('sellerId', '==', user.uid));
    }, [firestore, user]);

    const myRequestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'exchanges'), where('requesterId', '==', user.uid));
    }, [firestore, user]);

    const { data: incomingRequests, isLoading: isLoadingIncoming } = useCollection<ExchangeRequest>(incomingRequestsQuery);
    const { data: myRequests, isLoading: isLoadingMy } = useCollection<ExchangeRequest>(myRequestsQuery);
    
    return (
        <div className="space-y-6">
             <h1 className="text-2xl font-headline font-semibold">Exchanges</h1>
            <Tabs defaultValue="incoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>
                    <TabsTrigger value="my-requests">My Requests</TabsTrigger>
                </TabsList>
                <TabsContent value="incoming">
                    <Card>
                        <CardHeader>
                            <CardTitle>Incoming Requests</CardTitle>
                            <CardDescription>
                                Requests from other users for your items.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {!isLoadingIncoming && incomingRequests && incomingRequests.length > 0 ? (
                                incomingRequests.map(req => <RequestCard key={req.id} request={req} />)
                            ) : (
                                 !isLoadingIncoming && <EmptyState 
                                    title="No incoming requests"
                                    description="When someone wants to exchange an item with you, it will appear here."
                                />
                            )}
                            {isLoadingIncoming && <div className="p-12 text-center text-muted-foreground">Loading requests...</div>}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="my-requests">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Requests</CardTitle>
                            <CardDescription>
                                Your requests for items from other users.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                             {!isLoadingMy && myRequests && myRequests.length > 0 ? (
                                myRequests.map(req => <RequestCard key={req.id} request={req} />)
                            ) : (
                                !isLoadingMy && <EmptyState 
                                    isMyRequests
                                    title="You haven't made any requests"
                                    description="Start exploring and make an exchange request for an item you like."
                                />
                            )}
                             {isLoadingMy && <div className="p-12 text-center text-muted-foreground">Loading your requests...</div>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
