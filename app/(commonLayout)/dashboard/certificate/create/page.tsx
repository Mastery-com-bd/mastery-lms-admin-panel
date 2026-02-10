import CreateCertificate from "@/components/dashboard/certificate/createCertificate/CreateCertificate";
import { getAllCourses } from "@/service/course";

const CreateCertificatePage = async () => {
  const result = await getAllCourses({ limit: 1000 });
  const courses = result?.data || [];

  return (
    <section>
      <CreateCertificate courses={courses} />
    </section>
  );
};

export default CreateCertificatePage;
