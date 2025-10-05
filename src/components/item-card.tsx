
import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { User } from "@/lib/types"

import type { Item } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { getInitials } from "@/lib/utils"
import { Separator } from "./ui/separator"

interface ItemCardProps {
  item: Item;
  seller?: User;
}

export function ItemCard({ item, seller }: ItemCardProps) {
  return (
    <Card className="w-full overflow-hidden flex flex-col transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/items/${item.id}`}>
          <div className="relative aspect-[4/3] w-full">
            <Image
              alt={item.title}
              className="object-cover"
              fill
              src={item.images[0]}
              data-ai-hint="product image"
            />
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70">
            <Heart className="w-5 h-5 text-destructive" />
            <span className="sr-only">Add to wishlist</span>
        </Button>
         <div className="absolute top-2 left-2 flex gap-2">
            <Badge variant="secondary">{item.condition}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow grid gap-2">
         <Link href={`/items/${item.id}`}>
            <CardTitle className="font-headline text-lg hover:underline leading-tight">{item.title}</CardTitle>
          </Link>
        <div className="text-2xl font-bold text-primary">
          {item.isFree ? 'DONATE' : `$${item.price}`}
        </div>
        <p className="text-sm text-muted-foreground">📍 {item.location}</p>
      </CardContent>
      {seller && (
        <>
            <Separator />
            <CardFooter className="p-3">
                <div className="flex items-center gap-2 w-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={seller.avatarUrl} alt={seller.name} />
                            <AvatarFallback>{getInitials(seller.name)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5 text-sm flex-grow">
                            <p className="font-semibold truncate">{seller.name.split(' ')[0]}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{seller.rating.toFixed(1)}</span>
                        </div>
                    </div>
            </CardFooter>
        </>
      )}
    </Card>
  )
}
