import CreateCourse from "@/components/dashboard/courses/create-course";
import { TQuery } from "@/service/category";
import { getAllCourseElement } from "@/service/course";

const CreateCoursePage = async () => {
  const query: TQuery = {
    limit: 10,
    isActive: "true",
  };
  const result = await getAllCourseElement(query);
  const categories = result?.data?.category || [];
  const instructors = result?.data?.instructor || [];
  const subjects = result?.data?.subject || [];

  return (
    <div>
      <CreateCourse
        categories={categories}
        instructors={instructors}
        subjects={subjects}
      />
    </div>
  );
};

export default CreateCoursePage;
