import { Package, Eye, MessageSquare, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalProducts: number;
  publishedProducts: number;
  newInquiries: number;
  totalInquiries: number;
}

const cards = [
  { key: "totalProducts", label: "Total Products", icon: Package, color: "text-gold" },
  { key: "publishedProducts", label: "Published", icon: Eye, color: "text-green-400" },
  { key: "newInquiries", label: "New Inquiries", icon: MessageSquare, color: "text-yellow-400" },
  { key: "totalInquiries", label: "All Inquiries", icon: Inbox, color: "text-t2" },
] as const;

export function StatsCards(props: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <Card key={key} className="bg-char-dd">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-sm bg-char-d p-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-medium text-t1">{props[key]}</p>
              <p className="text-xs uppercase tracking-wider text-t3">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
