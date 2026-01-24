import { getAllSubject } from "@/service/subject";
import { TSearchParams } from "../categories/page";
import AllSubject from "@/components/dashboard/subject/allSubjects/AllSubject";

const AllSubjectPage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const result = await getAllSubject(query);
  const subjects = result?.data || [];
  const meta = result?.meta;
  return (
    <section>
      <AllSubject subjects={subjects} meta={meta} />
    </section>
  );
};

export default AllSubjectPage;
