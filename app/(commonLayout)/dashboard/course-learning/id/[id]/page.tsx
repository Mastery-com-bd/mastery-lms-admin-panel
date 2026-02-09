import CourseLearningDetails from "@/components/dashboard/course-learning/courseLearningDetails/CourseLearningDetails";
import { getASingleCourseLearning } from "@/service/courseLearning";

const CourseLearningDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getASingleCourseLearning(id);
  const courseLearning = result?.data;

  return (
    <section>
      <CourseLearningDetails courseLearning={courseLearning} />
    </section>
  );
};

export default CourseLearningDetailsPage;
