import UpdateCourse from "@/components/dashboard/courses/update/update-course";
import { getAllCategories } from "@/service/category";
import { getCourseDetailsById } from "@/service/course";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const courseDetails = await getCourseDetailsById(id);
  const categories = await getAllCategories({});

  return (
    <div>
      <UpdateCourse
        courseId={id}
        courseDetails={courseDetails?.data}
        categories={categories?.data}
      />
    </div>
  );
}
