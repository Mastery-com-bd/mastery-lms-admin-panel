import StudentDetails from "@/components/dashboard/students/student-details";
import { getStudentDetailsById } from "@/service/user";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsData = await params;
  const studentId = paramsData.id;

  const result = await getStudentDetailsById(studentId);
  const student = result?.data;

  console.log("Student Details :", student);

  return (
    <div>
      <StudentDetails />
    </div>
  );
};

export default Page;
