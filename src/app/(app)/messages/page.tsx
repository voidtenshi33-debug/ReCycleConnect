
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCollection, useDoc, useFirebase } from "@/firebase";
import type { Conversation, Item, User } from "@/lib/types";
import { collection, doc, query, where } from "firebase/firestore";
import { useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemoFirebase } from "@/firebase/provider";


function ChatListItemSkeleton() {
    return (
        <div className="p-4 flex gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-grow space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-full" />
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="p-6 bg-background rounded-full mb-4">
                <MessageSquare className="w-16 h-16 text-muted-foreground/50" />
            </div>
            <h3 className="font-headline text-2xl font-semibold">No messages yet.</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
                When a buyer contacts you, or you contact a seller, your conversations will appear here.
            </p>
            <Button asChild className="mt-6">
                <Link href="/home">Browse Items Now</Link>
            </Button>
        </div>
    );
}

function ChatListItem({ conversation, myUserId }: { conversation: Conversation, myUserId: string }) {
    const { firestore } = useFirebase();
    const pathname = usePathname();
    const isActive = pathname === `/messages/${conversation.id}`;

    const otherUserId = conversation.participants.find(p => p !== myUserId);

    const otherUserRef = useMemoFirebase(() => otherUserId ? doc(firestore, 'users', otherUserId) : null, [firestore, otherUserId]);
    const { data: otherUser } = useDoc<User>(otherUserRef);


    if (!otherUser) {
        return <ChatListItemSkeleton />;
    }

    const unreadCount = conversation.unreadCount?.[myUserId] || 0;

    return (
        <Link href={`/messages/${conversation.id}`} key={conversation.id}>
            <div className={cn(
                "p-4 border-b flex gap-4 hover:bg-muted/80 transition-colors",
                isActive && "bg-muted"
            )}>
                <div className="relative">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser.photoURL ?? undefined} alt={otherUser.displayName} />
                        <AvatarFallback>{otherUser.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* In a real app, online status would come from a presence system */}
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-muted" />
                </div>
                <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold truncate">{otherUser.displayName}</p>
                        {conversation.lastMessageTimestamp && (
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDistanceToNow(conversation.lastMessageTimestamp.toDate(), { addSuffix: true })}
                            </p>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">Re: item-id:{conversation.itemId}</p>
                    <div className="flex justify-between items-end mt-1">
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        {unreadCount > 0 && (
                            <div className="h-5 min-w-[1.25rem] bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold px-1.5">
                                {unreadCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}


export default function MessagesPage() {
    const { firestore, user, isUserLoading } = useFirebase();

    const conversationsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'conversations'), where('participants', 'array-contains', user.uid));
    }, [firestore, user]);

    const { data: conversations, isLoading: areConversationsLoading } = useCollection<Conversation>(conversationsQuery);
    
    const isLoading = areConversationsLoading || isUserLoading;

    if (!isLoading && conversations?.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                 <h2 className="text-xl font-headline font-semibold">Messages</h2>
                <div className="relative mt-2">
                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-8 bg-background" />
                </div>
            </div>
            <ScrollArea className="flex-grow">
                {isLoading ? (
                    <>
                        <ChatListItemSkeleton />
                        <ChatListItemSkeleton />
                        <ChatListItemSkeleton />
                        <ChatListItemSkeleton />
                    </>
                ) : (
                    conversations
                        ?.sort((a, b) => b.lastMessageTimestamp.toDate() - a.lastMessageTimestamp.toDate())
                        .map((convo) => (
                            <ChatListItem key={convo.id} conversation={convo} myUserId={user!.uid} />
                        ))
                )}
            </ScrollArea>
        </div>
    );
}
