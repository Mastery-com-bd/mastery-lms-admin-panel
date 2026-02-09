import CreateAllCourseRequirment from "@/components/dashboard/course-requirment/allCourseRequirement/CreateAllCourseRequirment";
import { getAllCoursesWithoutLimit } from "@/service/course";
import { getASingleCourseRequirment } from "@/service/courseRequirment";

const EditCourseRequirmentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [coursesResult, courseRequirmentResult] = await Promise.all([
    getAllCoursesWithoutLimit(),
    getASingleCourseRequirment(id),
  ]);

  const courses = coursesResult?.data?.data || coursesResult?.data || [];
  const courseRequirment = courseRequirmentResult?.data;

  return (
    <div className="p-6">
      <CreateAllCourseRequirment course={courses} courseRequirment={courseRequirment} />
    </div>
  );
};

export default EditCourseRequirmentPage;
