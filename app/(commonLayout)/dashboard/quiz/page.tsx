import { QuizListTable } from "@/components/dashboard/quiz/QuizListTable";
import { getAllQuizzes } from "@/service/quiz";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | number | undefined;
  }>;
}) => {
  const query = await searchParams;
  const result = await getAllQuizzes(query);

  console.log(result.data)

  return (
    <div className="p-5">
      <QuizListTable quizzes={result?.data || []} meta={result?.meta} />
    </div>
  );
};

export default Page;
