import CreateCourseLearning from "@/components/dashboard/course-learning/allCourseLearning/CreateCourseLearning";
import { getAllCoursesWithoutLimit } from "@/service/course";

const CreateCourseLearningPage = async () => {
  const result = await getAllCoursesWithoutLimit();
  const courses = result?.data?.data || result?.data || [];

  return (
    <div className="p-6">
      <CreateCourseLearning course={courses} />
    </div>
  );
};

export default CreateCourseLearningPage;
