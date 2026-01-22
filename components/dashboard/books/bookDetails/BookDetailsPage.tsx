/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TBooks } from "@/types/product.types";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BookDetails = ({ book }: { book: TBooks }) => {
  const router = useRouter();
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 " /> Back to All Books
      </Button>

      {/* Book Header */}
      <Card className="lg:flex lg:gap-6 p-4 lg:p-6">
        <div className="shrink-0 lg:w-64 h-80 relative rounded-lg overflow-hidden border">
          <Image
            src={book?.productImage}
            alt={book?.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="space-y-4 flex-1">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-bold">{book?.name}</CardTitle>
            <CardDescription>{book?.description}</CardDescription>
          </CardHeader>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">SKU: {book?.sku}</Badge>
            <Badge variant="secondary">Stock: {book?.stock}</Badge>
            <Badge
              variant={
                book?.productStatus === "PUBLISHED" ? "destructive" : "outline"
              }
            >
              {book?.productStatus}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-lg font-semibold">Price: ${book?.price}</p>
            <p className="text-sm text-muted-foreground">
              Category: {book?.productCategory?.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Created At: {new Date(book?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Book Order Items (if any) */}
      {book?.orderItems && book?.orderItems?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Purchased By</CardTitle>
            <CardDescription>
              List of students who purchased this book
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-48">
              <table className="w-full text-left table-auto">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {book?.orderItems.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{item?.user?.name || "N/A"}</td>
                      <td className="p-2">
                        {new Date(item?.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookDetails;
