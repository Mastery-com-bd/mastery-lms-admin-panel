import CourseRequirmentDetails from "@/components/dashboard/course-requirment/courseRequirmentDetails/CourseRequirmentDetails";
import { getASingleCourseRequirment } from "@/service/courseRequirment";

const CourseRequirmentDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getASingleCourseRequirment(id);
  const courseRequirment = result?.data;
  return (
    <section>
      <CourseRequirmentDetails courseRequirment={courseRequirment} />
    </section>
  );
};

export default CourseRequirmentDetailPage;
