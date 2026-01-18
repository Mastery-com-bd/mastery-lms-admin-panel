import UpdateQuiz from "@/components/dashboard/quiz/updateQuiz";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsData = await params;
  const quizId = paramsData.id;
  return (
    <div className="w-full h-full p-5">
      <UpdateQuiz quizId={quizId} />
    </div>
  );
};

export default Page;
