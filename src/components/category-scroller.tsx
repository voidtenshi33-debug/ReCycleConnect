
"use client"

import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { T } from "./t";

interface CategoryScrollerProps {
    onCategorySelect: (slug: string) => void;
    activeCategory: string;
}

export function CategoryScroller({ onCategorySelect, activeCategory }: CategoryScrollerProps) {
    
    const allCategory = { id: 'all', name: 'All', icon: () => <span className="text-lg">✨</span>, slug: 'all' };
    const displayCategories = [allCategory, ...categories];

    return (
        <div className="flex space-x-2 overflow-x-auto py-2 -mx-4 px-4">
            {displayCategories.map((category) => {
                const isActive = activeCategory === category.slug;
                return (
                    <Button 
                        key={category.id} 
                        variant={isActive ? "default" : "outline"}
                        className={cn(
                            "flex-shrink-0 text-center group h-auto flex flex-col items-center justify-center p-3 gap-2 rounded-2xl w-24 h-24 transition-all",
                             isActive ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                        )}
                        onClick={() => onCategorySelect(category.slug)}
                    >
                        <category.icon className={cn("h-8 w-8 text-muted-foreground transition-all", isActive ? "text-primary-foreground" : "group-hover:text-primary")} />
                        <p className={cn("text-xs font-medium text-muted-foreground transition-all", isActive ? "text-primary-foreground" : "group-hover:text-primary")}><T>{category.name}</T></p>
                    </Button>
                )
            })}
        </div>
    );
}
