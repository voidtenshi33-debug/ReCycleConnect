
"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const onboardingSteps = [
  {
    image: "https://picsum.photos/seed/recycle1/800/1200",
    imageHint: "electronics recycling",
    title: "Give Your Electronics a Second Life",
    description: "Easily list your used gadgets for sale or donation. Turn e-waste into cash or good karma.",
  },
  {
    image: "https://picsum.photos/seed/recycle2/800/1200",
    imageHint: "local community electronics",
    title: "Connect with Your E-Waste Community",
    description: "Discover great deals on pre-owned electronics near you, or find someone who needs your spare parts.",
  },
  {
    image: "https://picsum.photos/seed/recycle3/800/1200",
    imageHint: "repaired phone circuit",
    title: "Reduce, Reuse, ReCycleConnect",
    description: "Join a movement to reduce electronic waste. Every gadget you exchange makes a difference for our planet.",
  },
]

export default function WelcomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Carousel className="w-full">
          <CarouselContent>
            {onboardingSteps.map((step, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="relative flex aspect-[3/4] items-end justify-center p-6">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={step.imageHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-t-lg" />
                      <div className="relative z-10 text-center text-white space-y-2">
                        <h2 className="text-3xl font-headline font-bold">{step.title}</h2>
                        <p className="text-lg text-white/90">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="mt-6 flex flex-col items-center gap-4">
            <Button asChild className="w-full max-w-xs">
                <Link href="/home">
                    Start Recycling <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                Already have an account? Log In
            </Link>
        </div>
      </div>
    </div>
  )
}
