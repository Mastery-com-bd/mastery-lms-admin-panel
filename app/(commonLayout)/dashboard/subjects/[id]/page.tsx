import SubjectDetails from "@/components/dashboard/subject/subjectDetailsPage/SubjectDetails";
import { getASingleSubject } from "@/service/subject";

const SubjectDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getASingleSubject(id);
  const subject = result?.data;

  console.log("Subject Details :", subject);

  return (
    <section>
      <SubjectDetails subject={subject} />
    </section>
  );
};

export default SubjectDetailsPage;
