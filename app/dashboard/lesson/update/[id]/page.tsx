import UpdateLesson from "@/components/dashboard/lesson/update/update-lession";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsData = await params;
  const lessonId = paramsData.id;

  return (
    <div>
      <UpdateLesson lessonId={lessonId} />
    </div>
  );
};

export default Page;
