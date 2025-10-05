import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversations, items, users } from "@/lib/data";
import { cn } from "@/lib/utils";
import { SendHorizonal } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function MessageDetailPage({ params }: { params: { id: string } }) {
    const convo = conversations.find(c => c.id === params.id);
    if (!convo) notFound();

    const myUserId = users[0].id;
    const otherUserId = convo.participants.find(p => p !== myUserId);
    const otherUser = users.find(u => u.id === otherUserId);
    const item = items.find(i => i.id === convo.itemId);
    
    if (!otherUser || !item) notFound();

    return (
        <div className="col-span-3 lg:col-span-3 flex flex-col h-full bg-background">
            {/* Chat Header */}
            <div className="flex items-center gap-4 p-4 border-b">
                <Link href={`/items/${item.id}`} className="flex items-center gap-2 flex-grow overflow-hidden">
                    <Image src={item.images[0]} alt={item.title} width={40} height={40} className="rounded-md object-cover" />
                    <div className="overflow-hidden">
                        <p className="font-semibold truncate">{item.title}</p>
                        <p className="text-sm text-muted-foreground truncate">Conversation with {otherUser.name}</p>
                    </div>
                </Link>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-grow p-4">
                <div className="space-y-4">
                    {convo.messages.map(message => (
                        <div key={message.id} className={cn(
                            "flex items-end gap-2 max-w-[75%]",
                            message.senderId === myUserId ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={message.senderId === myUserId ? users[0].avatarUrl : otherUser.avatarUrl} />
                                <AvatarFallback>{(message.senderId === myUserId ? users[0].name : otherUser.name).charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "rounded-lg px-3 py-2 text-sm",
                                message.senderId === myUserId ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
                <form className="flex items-center gap-2">
                    <Input placeholder="Type your message..." className="flex-grow" />
                    <Button type="submit" size="icon">
                        <SendHorizonal className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}
