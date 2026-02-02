import CreateCertificate from "@/components/dashboard/certificate/createCertificate/CreateCertificate";
import { TSearchParams } from "../../categories/page";
import { getAllCourses } from "@/service/course";
import { getAllUsers } from "@/service/user";

const CreateCertificatePage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const userQuery = {
    ...query,
    role: "STUDENT",
    limit: 10,
  };

  const [usersResult, courseResult] = await Promise.all([
    getAllUsers(userQuery),
    getAllCourses({ limit: 1000 }),
  ]);

  const users = usersResult?.data || [];
  const courses = courseResult?.data || [];

  return (
    <section>
      <CreateCertificate users={users} courses={courses} />
    </section>
  );
};

export default CreateCertificatePage;
