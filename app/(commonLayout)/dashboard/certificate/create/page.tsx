import CreateCertificate from "@/components/dashboard/certificate/createCertificate/CreateCertificate";
import { TSearchParams } from "../../categories/page";
import { getAllUsers } from "@/service/user";
import { getAllCourses } from "@/service/course";

const CreateCertificatePage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  let query = await searchParams;
  query = { ...query, role: "STUDENT", limit: 1000 }; // Fetch enough students

  const result = await getAllUsers(query);
  const coursesResult = await getAllCourses({ limit: 1000 }); // Fetch enough courses
  
  const users = result?.data || [];
  const courses = coursesResult?.data || [];

  return (
    <section>
      <CreateCertificate users={users} courses={courses} />
    </section>
  );
};

export default CreateCertificatePage;
