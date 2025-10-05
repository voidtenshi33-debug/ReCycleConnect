
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
      <aside className={cn(
        "border-r bg-muted/40",
        // On mobile, hide the list when a conversation is selected
        !isRootMessages && "hidden md:block" 
      )}>
        <MessagesPage />
      </aside>

      <main className={cn(
        "md:col-span-2 lg:col-span-3",
         // On mobile, hide the main content when on the root messages page
        isRootMessages && "hidden md:flex" 
      )}>
        {isRootMessages ? (
            <div className="flex-col items-center justify-center text-center bg-background w-full hidden md:flex">
                <div className="p-6 bg-muted rounded-full mb-4">
                    <MessageSquare className="w-16 h-16 text-muted-foreground/50" />
                </div>
                <h3 className="font-headline text-2xl font-semibold">Select a conversation</h3>
                <p className="text-muted-foreground max-w-sm">Choose one of your existing conversations to read messages, or start a new one by contacting a seller.</p>
            </div>
        ) : children}
      </main>
    </div>
  );
}
