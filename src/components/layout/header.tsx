"use client"

import Link from "next/link"
import { Bell, CircleUser, Home, Leaf, Menu, Search, Heart, Repeat2, MessageSquare, User as UserIcon } from "lucide-react"

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
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for items..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
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
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
