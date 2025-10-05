import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { exchangeRequests, items, users } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const RequestCard = ({ request }: { request: typeof exchangeRequests[0] }) => {
    const item = items.find(i => i.id === request.itemId);
    const otherUser = users.find(u => u.id === (request.sellerId === users[0].id ? request.requesterId : request.sellerId));

    if (!item || !otherUser) return null;

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <Image src={item.images[0]} alt={item.title} width={64} height={64} className="rounded-md object-cover aspect-square" />
                <div>
                    <Link href={`/items/${item.id}`} className="font-semibold hover:underline">{item.title}</Link>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={otherUser.avatarUrl} />
                            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{otherUser.name}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Badge variant={request.status === 'Accepted' ? 'default' : request.status === 'Completed' ? 'secondary' : 'outline'}>{request.status}</Badge>
                {request.status === 'Pending' && <Button size="sm">Respond</Button>}
                {request.status === 'Completed' && <Button size="sm" variant="outline">Leave Rating</Button>}
            </div>
        </div>
    )
}

export default function ExchangesPage() {
    const myUserId = users[0].id;
    const incomingRequests = exchangeRequests.filter(r => r.sellerId === myUserId);
    const myRequests = exchangeRequests.filter(r => r.requesterId === myUserId);
    
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
                            {incomingRequests.length > 0 ? (
                                incomingRequests.map(req => <RequestCard key={req.id} request={req} />)
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">No incoming requests.</div>
                            )}
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
                             {myRequests.length > 0 ? (
                                myRequests.map(req => <RequestCard key={req.id} request={req} />)
                            ) : (
                                <div className="p-12 text-center text-muted-foreground">You haven't made any requests.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
