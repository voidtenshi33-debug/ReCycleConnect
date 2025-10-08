
'use client'

import { Suspense } from 'react';
import { PostItemForm } from '@/components/post-item-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function PostItemPageContent() {
    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/home" className="flex items-center gap-2 text-sm text-muted-foreground mb-4 hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to listings
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">List an E-Waste Item</CardTitle>
                    <CardDescription>Fill out the details below to list your electronic item for sale or donation.</CardDescription>
                </CardHeader>
                <CardContent>
                   <PostItemForm />
                </CardContent>
            </Card>
        </div>
    );
}


export default function PostItemPage() {
    return (
        <Suspense fallback={<div>Loading form...</div>}>
            <PostItemPageContent />
        </Suspense>
    );
}

