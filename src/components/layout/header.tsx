
"use client"

import Link from "next/link"
import { Bell, CircleUser, Home, Leaf, Menu, Search, Heart, Repeat2, MessageSquare, User as UserIcon, Mic, MapPin, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth, useUser } from "@/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { getInitials } from "@/lib/utils"
import { signOut } from "firebase/auth"
import { useState, useEffect } from "react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LocationModal } from "../location-modal"
import { locations } from "@/lib/data"


const MobileNavLink = ({ href, icon: Icon, children }: { href: string, icon: React.ElementType, children: React.ReactNode }) => {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", isActive && "bg-muted text-foreground")}
        >
            <Icon className="h-5 w-5" />
            {children}
        </Link>
    )
}

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);

  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  useEffect(() => {
    if (text) {
      setSearchQuery(text);
      // Optional: automatically submit search
      // router.push(`/search?q=${encodeURIComponent(text)}`);
    }
  }, [text, router]);
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // @ts-ignore - user is not known to have lastKnownLocality
  const currentLocation = locations.find(l => l.slug === user?.lastKnownLocality)?.name || "Select Location";

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/home"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <Leaf className="h-6 w-6 text-primary" />
              <span className="sr-only">ReCycleConnect</span>
            </Link>
            <MobileNavLink href="/home" icon={Home}>Home</MobileNavLink>
            <MobileNavLink href="/exchanges" icon={Repeat2}>Exchanges</MobileNavLink>
            <MobileNavLink href="/messages" icon={MessageSquare}>Messages</MobileNavLink>
            <MobileNavLink href="/wishlist" icon={Heart}>Wishlist</MobileNavLink>
            <MobileNavLink href="/profile" icon={UserIcon}>Profile</MobileNavLink>
          </nav>
        </SheetContent>
      </Sheet>
      
      <Button variant="ghost" className="shrink-0 gap-1.5 text-sm" onClick={() => setLocationModalOpen(true)}>
        <MapPin className="h-4 w-4" />
        <span className="hidden md:inline whitespace-nowrap">{currentLocation}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      <div className="w-full flex-1">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for items..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-2/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
             {hasRecognitionSupport && (
               <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                  onClick={startListening}
                >
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Search by voice</span>
               </Button>
            )}
          </div>
        </form>
      </div>
       <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Link>
       </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            {isUserLoading ? (
              <CircleUser className="h-5 w-5" />
            ) : user ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
            ) : (
              <CircleUser className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          { user ? (
            <>
              <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </>
          ) : (
             <>
              <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/signup">Sign Up</Link></DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

       {isListening && (
        <Dialog open onOpenChange={stopListening}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="relative">
                <Mic className="h-16 w-16 text-primary" />
                <div className="absolute inset-0 -z-10 bg-primary/20 rounded-full animate-ping"></div>
              </div>
              <p className="text-lg font-medium text-muted-foreground">Listening...</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
       <LocationModal
        isOpen={isLocationModalOpen}
        setIsOpen={setLocationModalOpen}
      />
    </header>
  )
}
