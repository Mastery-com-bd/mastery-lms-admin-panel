"use client";

import { Card } from "@/components/ui/card";
import CategoryFiltering from "../../category/all/CategoryFiltering";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TCertificate } from "@/types/certificate.types";
import { TMeta } from "@/types/types.meta";
import CustomPagination from "@/components/ui/CustomPagination";
import { certificateTableColumn } from "./AllCertificateTable";
import CustomTable from "@/components/ui/CustomTable";

const AllCertificate = ({
  certificates,
  meta,
}: {
  certificates: TCertificate[];
  meta: TMeta;
}) => {
  console.log(certificates);

  const column = certificateTableColumn();
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          All Certificate
        </h1>
        <Link href="/dashboard/certificate/create">
          <Button className="cursor-pointer">Issue Certificate</Button>
        </Link>
      </div>

      <Card className="border-none shadow-sm py-4">
        <CategoryFiltering />
        {/* Table */}
        <CustomTable data={certificates} columns={column} />

        {/* Pagination */}
        <CustomPagination pagination={meta} />
      </Card>
    </div>
  );
};

export default AllCertificate;
