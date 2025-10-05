
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversations, items, users } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function MessagesPage() {
    const myUserId = users[0].id;
    const pathname = usePathname();
    
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                 <h2 className="text-xl font-headline font-semibold">Messages</h2>
                <div className="relative mt-2">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-8" />
                </div>
            </div>
            <ScrollArea className="flex-grow">
                {conversations.map((convo) => {
                     const otherUserId = convo.participants.find(p => p !== myUserId);
                     const otherUser = users.find(u => u.id === otherUserId);
                     const item = items.find(i => i.id === convo.itemId);
                     if (!otherUser || !item) return null;

                     const isActive = pathname === `/messages/${convo.id}`;

                    return (
                        <Link href={`/messages/${convo.id}`} key={convo.id}>
                            <div className={cn(
                                "p-4 border-b flex gap-4 hover:bg-muted/80",
                                isActive && "bg-muted"
                            )}>
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                                    <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold truncate">{otherUser.name}</p>
                                        <p className="text-xs text-muted-foreground">{convo.lastMessage.timestamp}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">Re: {item.title}</p>
                                    <p className="text-sm text-muted-foreground truncate mt-1">{convo.lastMessage.text}</p>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </ScrollArea>
        </div>
    );
}
