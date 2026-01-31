import AllLesson from "@/components/dashboard/lesson/all/all-lesson";
import { getAllLessons } from "@/service/lessons";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | number | undefined;
  }>;
}) => {
  const query = await searchParams;
  const result = await getAllLessons(query);


  return (
    <div>
      <AllLesson lessons={result?.data || []} meta={result?.meta} />
    </div>
  );
};

export default Page;
