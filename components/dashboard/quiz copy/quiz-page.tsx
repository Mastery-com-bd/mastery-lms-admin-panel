import { mockAdminQuizzes } from "@/constants/adminQuizMockData";
import { QuizListTable } from "./QuizListTable";

const QuizPage = () => {
  return (
    <div className="w-full h-full p-6">
      <QuizListTable quizzes={mockAdminQuizzes} />
    </div>
  );
};

export default QuizPage;
