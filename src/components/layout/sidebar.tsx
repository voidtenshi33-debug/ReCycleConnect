
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Home, Leaf, MessageSquare, PlusCircle, Repeat2, User as UserIcon, Star, WandSparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { getInitials } from "@/lib/utils"
import { Separator } from "../ui/separator"
import { users } from "@/lib/data"
import { T } from "../t"

const NavLink = ({ href, icon: Icon, children, badge, exact = false }: { href: string; icon: React.ElementType; children: React.ReactNode; badge?: string; exact?: boolean; }) => {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
      {badge && <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">{badge}</Badge>}
    </Link>
  )
}

function UserProfileSnippet() {
  const { user } = useUser();
  
  // In a real app, you'd fetch the user's full profile from Firestore
  // For now, we'll find the matching user from mock data.
  const userProfile = users.find(u => u.id === user?.uid);
  const mockRating = userProfile?.averageRating || 0;


  if (!user) {
    return null;
  }

  return (
    <div className="px-4 lg:px-6 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? ""} />
          <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{user.displayName}</span>
           <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{mockRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/home" className="flex items-center gap-2 font-semibold">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg">ReCycleConnect</span>
          </Link>
        </div>
        <UserProfileSnippet />
        <Separator />
        <div className="flex-1 py-2 overflow-y-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink href="/home" icon={Home} exact><T>Home</T></NavLink>
            <NavLink href="/exchanges" icon={Repeat2}><T>Exchanges</T></NavLink>
            <NavLink href="/messages" icon={MessageSquare}><T>Messages</T></NavLink>
            <NavLink href="/valuator" icon={WandSparkles}><T>AI Valuator</T></NavLink>
            <NavLink href="/wishlist" icon={Heart}><T>Wishlist</T></NavLink>
            <NavLink href="/profile" icon={UserIcon}><T>Profile</T></NavLink>
          </nav>
        </div>
         <div className="mt-auto p-4">
            <Button asChild size="sm" className="w-full">
                <Link href="/post-item">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post Your E-Waste
                </Link>
            </Button>
        </div>
      </div>
    </div>
  )
}
