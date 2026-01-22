import { getAllCourseLearning } from "@/service/courseLearning";
import { TSearchParams } from "../categories/page";
import AllCourseLearning from "@/components/dashboard/course-learning/allCourseLearning/AllCourseLearning";

const CourseLearningPage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const result = await getAllCourseLearning(query);
  const course = result?.data?.course || [];
  const courseLearning = result?.data?.courseLearning?.data || [];
  const meta = result?.data?.courseLearning?.meta;
  return (
    <section>
      <AllCourseLearning
        course={course}
        learning={courseLearning}
        meta={meta}
      />
    </section>
  );
};

export default CourseLearningPage;
