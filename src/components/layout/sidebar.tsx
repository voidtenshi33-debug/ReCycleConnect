"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Home, Leaf, MessageSquare, PlusCircle, Repeat2, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLink href="/home" icon={Home} exact>Home</NavLink>
            <NavLink href="/exchanges" icon={Repeat2} badge="3">Exchanges</NavLink>
            <NavLink href="/messages" icon={MessageSquare}>Messages</NavLink>
            <NavLink href="/wishlist" icon={Heart}>Wishlist</NavLink>
            <NavLink href="/profile" icon={User}>Profile</NavLink>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button size="lg" className="w-full" asChild>
            <Link href="/post-item">
              <PlusCircle className="mr-2 h-5 w-5" /> Post an Item
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
