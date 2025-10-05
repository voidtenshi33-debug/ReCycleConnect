
"use client"

import Link from "next/link"
import { Bell, CircleUser, Home, Leaf, Menu, Search, Heart, Repeat2, MessageSquare, User as UserIcon, Mic, MapPin, ChevronDown, Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
import { useState } from "react"
import { LocationModal } from "../location-modal"
import { locations } from "@/lib/data"
import { useLanguage } from "@/context/language-context"
import { T } from "../t"


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
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isLocationModalOpen, setLocationModalOpen] = useState(false);
  const { locale, setLocale, availableLocales } = useLanguage();
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
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
            <span className="sr-only"><T>Toggle navigation menu</T></span>
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
            <MobileNavLink href="/home" icon={Home}><T>Home</T></MobileNavLink>
            <MobileNavLink href="/exchanges" icon={Repeat2}><T>Exchanges</T></MobileNavLink>
            <MobileNavLink href="/messages" icon={MessageSquare}><T>Messages</T></MobileNavLink>
            <MobileNavLink href="/wishlist" icon={Heart}><T>Wishlist</T></MobileNavLink>
            <MobileNavLink href="/profile" icon={UserIcon}><T>Profile</T></MobileNavLink>
          </nav>
        </SheetContent>
      </Sheet>
      
      <Button variant="ghost" className="shrink-0 gap-1.5 text-sm" onClick={() => setLocationModalOpen(true)}>
        <MapPin className="h-4 w-4" />
        <span className="hidden md:inline whitespace-nowrap">{currentLocation}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

       <div className="relative w-full flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </div>
        
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Languages className="h-5 w-5" />
            <span className="sr-only"><T>Change language</T></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel><T>Select Language</T></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
            {availableLocales.map((loc) => (
              <DropdownMenuRadioItem key={loc.code} value={loc.code}>{loc.name}</DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

       <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              <span className="sr-only"><T>Toggle notifications</T></span>
            </Link>
       </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            {user ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
            ) : (
              <CircleUser className="h-5 w-5" />
            )}
            <span className="sr-only"><T>Toggle user menu</T></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          { user ? (
            <>
              <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/profile"><T>Profile</T></Link></DropdownMenuItem>
              <DropdownMenuItem><T>Settings</T></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}><T>Logout</T></DropdownMenuItem>
            </>
          ) : (
             <>
              <DropdownMenuItem asChild><Link href="/login"><T>Login</T></Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/signup"><T>Sign Up</T></Link></DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

       <LocationModal
        isOpen={isLocationModalOpen}
        setIsOpen={setLocationModalOpen}
      />
    </header>
  )
}
