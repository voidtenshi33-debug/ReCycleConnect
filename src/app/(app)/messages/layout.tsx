
"use client"

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageSquare } from 'lucide-react';
import MessagesPage from './page';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRootMessages = pathname === '/messages';

  return (
    <div className="grid h-[calc(100vh-theme(spacing.14))] grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 -m-4 lg:-m-6">
      <div className={cn(
        "border-r bg-muted/40",
        !isRootMessages && "hidden md:block" 
      )}>
        <MessagesPage />
      </div>

      <div className={cn(
        "col-span-1 md:col-span-2 lg:col-span-3",
        isRootMessages && "hidden md:flex" 
      )}>
        {isRootMessages ? (
            <div className="flex-col items-center justify-center text-center bg-background w-full hidden md:flex">
                <MessageSquare className="w-16 h-16 text-muted-foreground/50" />
                <h3 className="font-headline text-xl mt-4">Select a conversation</h3>
                <p className="text-muted-foreground">Choose one of your existing conversations to read messages.</p>
            </div>
        ) : children}
      </div>
    </div>
  );
}
