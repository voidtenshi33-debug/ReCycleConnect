'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowLeft, SendHorizonal, CheckCheck, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useCollection, useDoc, useFirebase } from "@/firebase";
import { collection, doc, orderBy, query, serverTimestamp, addDoc, updateDoc } from "firebase/firestore";
import type { Conversation, Item, User, ChatMessage } from "@/lib/types";
import { format } from 'date-fns';
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useMemoFirebase } from "@/firebase/provider";
import { Skeleton } from "@/components/ui/skeleton";

const QuickReplyButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <Button variant="outline" size="sm" className="rounded-full h-auto py-1.5 px-4 text-xs" onClick={onClick}>
        {children}
    </Button>
)

function MessageSkeleton() {
    return (
        <div className="flex items-end gap-2 max-w-[75%]">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-grow space-y-2">
                <Skeleton className="h-8 w-48 rounded-lg" />
            </div>
        </div>
    );
}

function MessageDetailContent({ conversationId }: { conversationId: string }) {
    const { firestore, user } = useFirebase();
    const [messageText, setMessageText] = useState("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const convoRef = useMemoFirebase(() => firestore ? doc(firestore, 'conversations', conversationId) : null, [firestore, conversationId]);
    const { data: convo, isLoading: isConvoLoading } = useDoc<Conversation>(convoRef);

    const otherUserId = useMemo(() => convo?.participants.find(p => p !== user?.uid), [convo, user]);

    const otherUserRef = useMemoFirebase(() => (firestore && otherUserId) ? doc(firestore, 'users', otherUserId) : null, [firestore, otherUserId]);
    const { data: otherUser, isLoading: isOtherUserLoading } = useDoc<User>(otherUserRef);

    const itemRef = useMemoFirebase(() => (firestore && convo) ? doc(firestore, 'items', convo.itemId) : null, [firestore, convo]);
    const { data: item, isLoading: isItemLoading } = useDoc<Item>(itemRef);

    const messagesQuery = useMemoFirebase(() => (firestore && convo) ? query(collection(firestore, 'conversations', convo.id, 'messages'), orderBy('timestamp', 'asc')) : null, [firestore, convo]);
    const { data: messages, isLoading: areMessagesLoading } = useCollection<ChatMessage>(messagesQuery);
    
     useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
        }
    }, [messages]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !user || !firestore || !convo || !otherUserId) return;
        
        const textToSend = messageText;
        setMessageText(""); // Optimistic UI update

        const messagesCol = collection(firestore, 'conversations', convo.id, 'messages');
        const convoRef = doc(firestore, 'conversations', convo.id);

        try {
            await addDoc(messagesCol, {
                text: textToSend,
                senderId: user.uid,
                timestamp: serverTimestamp(),
                isRead: false
            });

            await updateDoc(convoRef, {
                lastMessage: textToSend,
                lastMessageTimestamp: serverTimestamp(),
                [`unreadCount.${otherUserId}`]: (convo.unreadCount[otherUserId] || 0) + 1
            });
        } catch (error) {
            console.error("Error sending message:", error);
            setMessageText(textToSend); // Revert on error
        }
    };

    const handleQuickReply = (text: string) => {
        setMessageText(text);
        // Optionally, you could auto-send it
        // handleSendMessage(new Event('submit') as any);
    }
    
    const isLoading = isConvoLoading || isOtherUserLoading || isItemLoading || areMessagesLoading;

    if (isLoading) {
       return <div className="p-4 h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (!convo || !otherUser || !item || !user) {
        return <div className="p-4">Conversation not found.</div>;
    }

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
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages ? messages.map((message) => (
                        <div key={message.id} className={cn(
                            "flex items-end gap-2 max-w-[75%]",
                            message.senderId === user.uid ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={message.senderId === user.uid ? user.photoURL ?? undefined : otherUser.photoURL ?? undefined} />
                                <AvatarFallback>{(message.senderId === user.uid ? user.displayName : otherUser.displayName)?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "rounded-lg px-3 py-2 text-sm relative group",
                                message.senderId === user.uid ? "bg-primary text-primary-foreground" : "bg-muted"
                            )}>
                                <p>{message.text}</p>
                                <div className="flex items-center gap-1.5 text-xs text-right mt-1.5 opacity-70">
                                    <span>{message.timestamp ? format(message.timestamp.toDate(), 'p') : '...'}</span>
                                    {message.senderId === user.uid && <CheckCheck className="w-4 h-4 text-accent" />}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <>
                            <MessageSkeleton />
                            <div className="ml-auto"><MessageSkeleton /></div>
                        </>
                    )}
                </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="px-4 py-2 border-t flex gap-2 overflow-x-auto">
                 <QuickReplyButton onClick={() => handleQuickReply("Is this still available?")}>Is this still available?</QuickReplyButton>
                 <QuickReplyButton onClick={() => handleQuickReply("I'll take it!")}>I'll take it!</QuickReplyButton>
                 <QuickReplyButton onClick={() => handleQuickReply("Can we meet at your location?")}>
                    <MapPin className="mr-1.5 h-3 w-3" />
                    Share Location
                </QuickReplyButton>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-muted/40">
                <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                    <Input placeholder="Type your message..." className="flex-grow bg-background" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
                    <Button type="submit" size="icon" disabled={!messageText.trim()}>
                        <SendHorizonal className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
}


export default function MessageDetailPage({ params }: { params: { id: string } }) {
    return <MessageDetailContent conversationId={params.id} />;
}
