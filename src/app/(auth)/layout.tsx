import Link from "next/link";
import { Leaf } from "lucide-react";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseClientProvider>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
        <div className="absolute top-4 left-4 md:top-8 md:left-8">
          <Link href="/welcome" className="flex items-center gap-2 text-foreground">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">ReCycleConnect</span>
          </Link>
        </div>
        {children}
      </div>
    </FirebaseClientProvider>
  );
}
