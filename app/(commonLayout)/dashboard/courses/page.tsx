import AllCourse from "@/components/dashboard/courses/all-course";
import { getAllCourses } from "@/service/course";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | number | undefined;
  }>;
}) => {
  const query = await searchParams;
  const result = await getAllCourses(query);

  return (
    <div>
      <AllCourse courses={result?.data || []} meta={result?.meta} />
    </div>
  );
};

export default Page;
