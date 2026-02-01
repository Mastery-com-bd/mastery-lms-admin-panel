import CreateCertificate from "@/components/dashboard/certificate/createCertificate/CreateCertificate";
import { TSearchParams } from "../../categories/page";
import { getAllUsers } from "@/service/user";
import { getAllCourses } from "@/service/course";

const CreateCertificatePage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  
  // Initial fetch with limit 10 as requested
  const userQuery = { 
    ...query, 
    role: "STUDENT", 
    limit: 10 
  };

  const result = await getAllUsers(userQuery);
  const coursesResult = await getAllCourses({ limit: 1000 }); // Keep courses limit high for now
  
  const users = result?.data || [];
  const courses = coursesResult?.data || [];

  return (
    <section>
      <CreateCertificate users={users} courses={courses} />
    </section>
  );
};

export default CreateCertificatePage;
