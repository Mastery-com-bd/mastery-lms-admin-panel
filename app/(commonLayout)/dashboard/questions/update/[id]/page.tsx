import UpdateQuestion from "@/components/dashboard/questions/update/update-question";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsData = await params;
  const questionId = paramsData.id;
  return (
    <div className="w-full h-full p-5">
      <UpdateQuestion questionId={questionId} />
    </div>
  );
};

export default Page;
