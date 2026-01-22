import { getAllCourseRequirment } from "@/service/courseRequirment";
import { TSearchParams } from "../categories/page";
import AllCourseRequirment from "@/components/dashboard/course-requirment/allCourseRequirement/AllCourseRequirment";

const CourseRequirmentPage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const result = await getAllCourseRequirment(query);

  const course = result?.data?.course || [];
  const courseRequirment = result?.data?.courseRequirement?.data || [];
  const meta = result?.data?.courseRequirement?.meta;

  return (
    <section>
      <AllCourseRequirment
        course={course}
        meta={meta}
        courseRequirment={courseRequirment}
      />
    </section>
  );
};

export default CourseRequirmentPage;
