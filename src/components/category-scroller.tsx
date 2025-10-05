
"use client"

import Link from "next/link";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

export function CategoryScroller() {
    return (
        <div className="flex space-x-4 overflow-x-auto py-2 -mx-4 px-4">
            {categories.map((category) => (
                <Link href={`/search?category=${category.slug}`} key={category.id} className="flex-shrink-0 text-center group">
                    <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:border-primary border-2 border-transparent">
                        <category.icon className="h-10 w-10 text-muted-foreground transition-all group-hover:text-primary" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-muted-foreground transition-all group-hover:text-primary">{category.name}</p>
                </Link>
            ))}
        </div>
    );
}
