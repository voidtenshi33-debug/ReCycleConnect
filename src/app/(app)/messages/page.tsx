import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { conversations, items, users } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MessagesPage() {
    const myUserId = users[0].id;
    
    return (
        <>
            <div className="col-span-1 border-r bg-muted/40">
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                         <h2 className="text-xl font-headline font-semibold">Messages</h2>
                        <div className="relative mt-2">
                             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search conversations..." className="pl-8" />
                        </div>
                    </div>
                    <ScrollArea className="flex-grow">
                        {conversations.map((convo, index) => {
                             const otherUserId = convo.participants.find(p => p !== myUserId);
                             const otherUser = users.find(u => u.id === otherUserId);
                             const item = items.find(i => i.id === convo.itemId);
                             if (!otherUser || !item) return null;

                            return (
                                <Link href={`/messages/${convo.id}`} key={convo.id}>
                                    <div className={cn(
                                        "p-4 border-b flex gap-4 hover:bg-muted/80",
                                        index === 0 && "bg-muted" // Mocking the first one as active
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
                                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.text}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </ScrollArea>
                </div>
            </div>
            <div className="hidden md:flex col-span-2 lg:col-span-3 flex-col items-center justify-center text-center bg-background">
                <MessageSquare className="w-16 h-16 text-muted-foreground/50" />
                <h3 className="font-headline text-xl mt-4">Select a conversation</h3>
                <p className="text-muted-foreground">Choose one of your existing conversations to read messages.</p>
            </div>
        </>
    );
}
