import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/admin/Topbar";
import { StatsCards } from "@/components/admin/StatsCards";
import { InquiryTable } from "@/components/admin/InquiryTable";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [totalProducts, publishedProducts, newInquiries, totalInquiries, recentInquiries] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { published: true } }),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.inquiry.count(),
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="flex-1 space-y-6 p-6">
        <StatsCards
          totalProducts={totalProducts}
          publishedProducts={publishedProducts}
          newInquiries={newInquiries}
          totalInquiries={totalInquiries}
        />

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-t3">Recent Inquiries</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/inquiries">View all</Link>
            </Button>
          </div>
          <InquiryTable inquiries={recentInquiries} />
        </div>
      </div>
    </>
  );
}
