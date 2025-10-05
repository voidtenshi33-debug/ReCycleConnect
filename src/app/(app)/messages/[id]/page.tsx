
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversations, items, users } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowLeft, SendHorizonal, CheckCheck, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const QuickReplyButton = ({ children }: { children: React.ReactNode }) => (
    <Button variant="outline" size="sm" className="rounded-full h-auto py-1.5 px-4 text-xs">
        {children}
    </Button>
)


export default function MessageDetailPage({ params }: { params: { id: string } }) {
    const convo = conversations.find(c => c.id === params.id);
    if (!convo) notFound();

    const myUserId = "user_01";
    const otherUserId = convo.participants.find(p => p !== myUserId);
    const otherUser = users.find(u => u.id === otherUserId);
    const me = users.find(u => u.id === myUserId);
    const item = items.find(i => i.id === convo.itemId);
    
    if (!otherUser || !item || !me) notFound();

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Chat Header */}
            <div className="flex items-center gap-4 p-2 md:p-4 border-b">
                <Link href="/messages" className="p-2 md:hidden">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back to messages</span>
                </Link>
                <Avatar>
                    <AvatarImage src={otherUser.photoURL ?? undefined} />
                    <AvatarFallback>{otherUser.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow overflow-hidden">
                    <p className="font-semibold truncate">{otherUser.displayName}</p>
                    <p className="text-sm text-muted-foreground truncate">Online</p>
                </div>
            </div>
            
            {/* Contextual Item Header */}
             <Card className="m-2 md:m-4 rounded-lg shadow-sm">
                <CardContent className="p-3">
                    <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image src={item.imageUrls[0]} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <p className="font-semibold truncate">{item.title}</p>
                            <p className="text-xl font-bold text-primary mt-1">{item.listingType === 'Donate' ? 'DONATE' : `₹${item.price}`}</p>
                        </div>
                        <Button asChild variant="secondary" size="sm">
                            <Link href={`/items/${item.id}`}>View Item</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Messages */}
            <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                    {convo.messages.map((message, index) => (
                        <div key={message.id} className={cn(
                            "flex items-end gap-2 max-w-[75%]",
                            message.senderId === myUserId ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={message.senderId === myUserId ? me.photoURL ?? undefined : otherUser.photoURL ?? undefined} />
                                <AvatarFallback>{(message.senderId === myUserId ? me.displayName : otherUser.displayName).charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "rounded-lg px-3 py-2 text-sm relative group",
                                message.senderId === myUserId ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                <p>{message.text}</p>
                                <div className="flex items-center gap-1.5 text-xs text-right mt-1.5 opacity-70">
                                    <span>{message.timestamp}</span>
                                    {message.senderId === myUserId && <CheckCheck className="w-4 h-4 text-accent" />}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Typing indicator example */}
                     <div className="flex items-center gap-2 max-w-[75%] mr-auto">
                         <Avatar className="h-8 w-8">
                            <AvatarImage src={otherUser.photoURL ?? undefined} />
                            <AvatarFallback>{otherUser.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-4 py-2 bg-muted text-muted-foreground text-sm">
                            <span className="animate-pulse">●</span>
                            <span className="animate-pulse delay-150">●</span>
                            <span className="animate-pulse delay-300">●</span>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto">
                 <QuickReplyButton>Is this still available?</QuickReplyButton>
                 <QuickReplyButton>I'll take it!</QuickReplyButton>
                 <QuickReplyButton>
                    <MapPin className="mr-1.5 h-3 w-3" />
                    Share Location
                </QuickReplyButton>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-muted/40">
                <form className="flex items-center gap-2">
                    <Input placeholder="Type your message..." className="flex-grow bg-background" />
                    <Button type="submit" size="icon">
                        <SendHorizonal className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}
