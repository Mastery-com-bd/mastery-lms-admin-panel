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
  query = { ...query, role: "STUDENT" };

  const result = await getAllUsers(query);
  const courses = await getAllCourses();
  console.log(result);
  console.log(courses);
  return (
    <section>
      <CreateCertificate />
    </section>
  );
};

export default CreateCertificatePage;
