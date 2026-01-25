/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { convertDate } from "@/utills/convertDate";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import Image from "next/image";
import TooltipComponent from "@/components/ui/TooltipComponent";
import { TCertificate } from "@/types/certificate.types";
import CategorySorting from "../../category/all/CategorySorting";
import CategoryDropdown from "../../category/all/CategoryDropdown";
import { deleteCertificate } from "@/service/certificate";

export const certificateTableColumn = (): ColumnDef<TCertificate>[] => [
  {
    id: "user",
    header: () => (
      <div className="flex items-center gap-1">
        <CategorySorting name="Students" sort="name" />
      </div>
    ),
    cell: ({ row }) => {
      const name = row.original?.user?.fullName;
      const trimedName = name.length > 30 ? name.slice(0, 16) + "..." : name;
      return (
        <div className=" flex items-center gap-2">
          <Image
            src={
              row.original?.user?.profilePhoto ||
              "https://res.cloudinary.com/dbb6nen3p/image/upload/v1762848442/no_image_s3demz.png"
            }
            height={50}
            width={50}
            alt={name}
            className="h-10 w-10 rounded-full"
          />
          <TooltipComponent name={name} trimedName={trimedName} />;
        </div>
      );
    },
  },
  {
    id: "course",
    header: "Course",
    cell: ({ row }) => {
      const name = row.original?.course?.title;
      const trimedName = name.length > 50 ? name.slice(0, 16) + "..." : name;
      return <TooltipComponent name={name} trimedName={trimedName} />;
    },
  },

  {
    id: "Certificate",
    header: "Certificate",
    cell: ({ row }) => {
      const certificateImage = row.original?.certificatImage;

      return (
        <div className=" flex items-center gap-2">
          <Image
            src={
              certificateImage ||
              "https://res.cloudinary.com/dbb6nen3p/image/upload/v1762848442/no_image_s3demz.png"
            }
            height={50}
            width={50}
            alt={row.original?.user?.fullName || "Certificate Image"}
            className="h-10 w-10 rounded-full"
          />
        </div>
      );
    },
  },

  {
    accessorKey: "issuedAt",
    header: () => (
      <div className="flex items-center gap-1">
        <CategorySorting name="Issued At" sort="issuedAt" />
      </div>
    ),
    cell: ({ row }) => {
      const { creationDate, creationTime } = convertDate(
        new Date(row.original?.issuedAt),
      );

      return (
        <h1 className="flex flex-col items-start">
          <span>{creationDate}</span>
          <span>{creationTime}</span>
        </h1>
      );
    },
  },

  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const id = row.original?.id;
      const handleDelete = async (
        id: string,
        setOpen: Dispatch<SetStateAction<boolean>>,
        setLoading: Dispatch<SetStateAction<boolean>>,
      ) => {
        setLoading(true);
        const toastId = toast.loading("certificate deleting", {
          duration: 3000,
        });
        try {
          const result = await deleteCertificate(id);
          if (result?.success) {
            toast.success(result?.message, { id: toastId, duration: 3000 });
            setLoading(false);
            setOpen(false);
          } else {
            toast.error(result?.message, { id: toastId, duration: 3000 });
            setLoading(false);
          }
        } catch (error: any) {
          console.log(error);
          setLoading(false);
        }
      };

      return (
        <CategoryDropdown
          id={id}
          handleDelete={handleDelete}
        ></CategoryDropdown>
      );
    },
  },
];
