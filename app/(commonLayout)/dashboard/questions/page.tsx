import AllQuestion from "@/components/dashboard/questions/all/all-question";
import { getAllQuestions } from "@/service/questions";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | number | undefined;
  }>;
}) => {
  const query = await searchParams;
  const result = await getAllQuestions(query);


  return <AllQuestion questions={result?.data || []} meta={result?.meta} />;
};

export default Page;
