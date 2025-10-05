import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
        <Button asChild className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg lg:hidden" size="icon">
          <Link href="/post-item">
            <Plus className="h-8 w-8" />
            <span className="sr-only">Post Item</span>
          </Link>
        </Button>
      </div>
    </FirebaseClientProvider>
  );
}
