import CreateAllCourseRequirment from "@/components/dashboard/course-requirment/allCourseRequirement/CreateAllCourseRequirment";
import { getAllCoursesWithoutLimit } from "@/service/course";

const CreateCourseRequirmentPage = async () => {
  const result = await getAllCoursesWithoutLimit();
  const courses = result?.data?.data || result?.data || [];

  return (
    <div className="p-6">
      <CreateAllCourseRequirment course={courses} />
    </div>
  );
};

export default CreateCourseRequirmentPage;
