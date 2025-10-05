import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notifications } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MessageSquare, Repeat2, Star } from "lucide-react";
import Link from "next/link";


const iconMap = {
    new_message: MessageSquare,
    request_accepted: Repeat2,
    item_shipped: Repeat2,
    new_rating: Star,
    request_received: Repeat2,
}

export default function NotificationsPage() {
    return (
        <div className="max-w-4xl mx-auto">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Notifications</CardTitle>
                    <CardDescription>All your recent updates in one place.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {notifications.map((notif) => {
                        const Icon = iconMap[notif.type];
                        return (
                            <Link key={notif.id} href={notif.link} className="block hover:bg-muted">
                                <div className="p-4 border-b flex items-start gap-4">
                                     {!notif.isRead && (
                                        <div className="h-2.5 w-2.5 mt-1.5 rounded-full bg-primary" />
                                    )}
                                    <div className={cn("flex-grow", notif.isRead && "ml-4")}>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                            <Icon className="w-4 h-4" />
                                            <span>{notif.createdAt}</span>
                                        </div>
                                        <p>{notif.text}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    {notifications.length === 0 && (
                         <div className="p-12 text-center text-muted-foreground">You have no notifications.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
