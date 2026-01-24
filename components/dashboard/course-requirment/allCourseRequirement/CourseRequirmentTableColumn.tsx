/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { convertDate } from "@/utills/convertDate";
import { ColumnDef } from "@tanstack/react-table";
import CategorySorting from "../../category/all/CategorySorting";
import CategoryDropdown from "../../category/all/CategoryDropdown";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { TCourseLearningData } from "@/types/courseLearning.types";
import { deleteCourseRequirment } from "@/service/courseRequirment";
import CreateAllCourseRequirment from "./CreateAllCourseRequirment";
import { TCourse } from "@/types/course.types";
import TooltipComponent from "@/components/ui/TooltipComponent";

export const courseRequirmentTableColumn = (
  course: TCourse[],
): ColumnDef<TCourseLearningData>[] => [
  {
    id: "course",
    header: "Course",
    cell: ({ row }) => {
      const name = row.original?.course?.title;
      const trimedName = name.length > 30 ? name.slice(0, 16) + "..." : name;
      return (
        <div className="relative group inline-block">
          <h1>{trimedName}</h1>
          <p className="absolute bottom-full left-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-2 py-1 shadow-md whitespace-nowrap z-10">
            {name}
          </p>
        </div>
      );
    },
  },
  {
    id: "description",
    header: "Description",
    cell: ({ row }) => {
      const name = row.original?.content;
      const trimedName = name.length > 50 ? name.slice(0, 16) + "..." : name;
      return <TooltipComponent name={name} trimedName={trimedName} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original?.isActive;
      return (
        <Badge variant={status ? "default" : "secondary"}>
          {status ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "order",
    header: "Order",
  },

  {
    accessorKey: "createdAt",
    header: () => (
      <div className="flex items-center gap-1">
        <CategorySorting name="Created" sort="createdAt" />
      </div>
    ),
    cell: ({ row }) => {
      const { creationDate, creationTime } = convertDate(
        new Date(row.original?.createdAt),
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
      const courseRequirment = row.original;

      const handleDelete = async (
        id: string,
        setOpen: Dispatch<SetStateAction<boolean>>,
        setLoading: Dispatch<SetStateAction<boolean>>,
      ) => {
        setLoading(true);
        const toastId = toast.loading("course learning requirment", {
          duration: 3000,
        });
        try {
          const result = await deleteCourseRequirment(id);
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
          path={`/dashboard/course-requirment/${id}`}
        >
          <CreateAllCourseRequirment
            course={course}
            courseRequirment={courseRequirment}
          />
        </CategoryDropdown>
      );
    },
  },
];
