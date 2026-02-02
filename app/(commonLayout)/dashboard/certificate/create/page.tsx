import CreateCertificate from "@/components/dashboard/certificate/createCertificate/CreateCertificate";
import { TSearchParams } from "../../categories/page";
import { getAllCourses } from "@/service/course";
import { getAllUsers } from "@/service/user";

const CreateCertificatePage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  let query = await searchParams;
  query = { ...query, role: "STUDENT" };
  const result = await getAllUsers(query);
  const courses = await getAllCourses();
  console.log(result);
  console.log(courses);
  return (
    <section>
      <CreateCertificate users={users} courses={courses} />
    </section>
  );
};

export default CreateCertificatePage;
