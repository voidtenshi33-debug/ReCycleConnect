import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

import type { Item } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Card className="w-full overflow-hidden flex flex-col transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/items/${item.id}`}>
          <Image
            alt={item.title}
            className="aspect-[4/3] w-full object-cover"
            height={300}
            src={item.images[0]}
            width={400}
            data-ai-hint="product image"
          />
        </Link>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/70">
            <Heart className="w-5 h-5 text-destructive" />
            <span className="sr-only">Add to wishlist</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="grid gap-1.5">
          <Link href={`/items/${item.id}`}>
            <CardTitle className="font-headline text-lg hover:underline">{item.title}</CardTitle>
          </Link>
          <p className="text-sm text-muted-foreground">{item.location}</p>
        </div>
        <Badge variant="outline" className="mt-2">{item.condition}</Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">
          {item.isFree ? 'FREE' : `$${item.price}`}
        </div>
        <p className="text-xs text-muted-foreground">{item.postedAt}</p>
      </CardFooter>
    </Card>
  )
}
