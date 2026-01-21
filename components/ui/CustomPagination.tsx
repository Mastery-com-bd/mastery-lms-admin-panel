"use client";

import { TMeta } from "@/types/types.meta";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const CustomPagination = ({ pagination }: { pagination: TMeta }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  const totalPage = Math.ceil(pagination?.total / pagination?.limit);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      router.push(`${pathname}?page=${currentPage - 1}`);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
      router.push(`${pathname}?page=${currentPage + 1}`);
    }
  };

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPage, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(1);
              router.push(`${pathname}?page=${1}`);
            }}
            href="#"
            className={`${
              currentPage === 1 && "bg-[rgba(248,248,248,0.10)] rounded-xl"
            }`}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (start > 2) {
        pages.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
              router.push(`${pathname}?page=${i}`);
            }}
            href="#"
            className={`${
              currentPage === i && "bg-[rgba(248,248,248,0.10)] rounded-xl"
            }`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (end < totalPage) {
      if (end < totalPage - 1) {
        pages.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      pages.push(
        <PaginationItem key={totalPage}>
          <PaginationLink
            isActive={currentPage === totalPage}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPage);
              router.push(`${pathname}?page=${totalPage}`);
            }}
            href="#"
            className={`${
              currentPage === totalPage &&
              "bg-[rgba(248,248,248,0.10)] rounded-xl"
            }`}
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <div className=" flex items-center justify-center gap-6">
          {/* pagination previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePrev();
              }}
              href="#"
              className={` border border-[#8A8A8A] rounded-xl ${
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }`}
            />
          </PaginationItem>

          <div className="flex items-center justify-center gap-1">
            {renderPages()}
          </div>

          {/* pagination next */}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPage) handleNext();
              }}
              href="#"
              className={` border border-[#8A8A8A] rounded-xl ${
                currentPage === totalPage
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            />
          </PaginationItem>
        </div>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
