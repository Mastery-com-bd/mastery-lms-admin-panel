import CreateCourseLearning from "@/components/dashboard/course-learning/allCourseLearning/CreateCourseLearning";
import { getAllCoursesWithoutLimit } from "@/service/course";
import { getASingleCourseLearning } from "@/service/courseLearning";

const EditCourseLearningPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const [coursesResult, courseLearningResult] = await Promise.all([
    getAllCoursesWithoutLimit(),
    getASingleCourseLearning(id),
  ]);

  const courses = coursesResult?.data?.data || coursesResult?.data || [];
  const courseLearning = courseLearningResult?.data;

  return (
    <div className="p-6">
      <CreateCourseLearning course={courses} courseLearning={courseLearning} />
    </div>
  );
};

export default EditCourseLearningPage;
