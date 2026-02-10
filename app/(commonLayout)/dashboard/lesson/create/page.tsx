import CreateLesson from "@/components/dashboard/lesson/create/create-lesson";
import { getAllCoursesWithoutLimit } from "@/service/course";

const Page = async () => {

  const fetchAllCourse = await getAllCoursesWithoutLimit();
  

  return (
    <div>
      <CreateLesson courses={fetchAllCourse.data} />
    </div>
  );
};

export default Page;
