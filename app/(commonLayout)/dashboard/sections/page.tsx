import AllSection from "@/components/dashboard/section/all/all-section";
import { getAllSections } from "@/service/sections";


const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | number | undefined;
  }>;
}) => {
  const query = await searchParams;
  const result = await getAllSections({
    ...query,
    sortBy: (query.sortBy as string) || "createdAt",
    sortOrder: (query.sortOrder as string) || "asc",
  });

  return (
    <div>
      <AllSection sections={result?.data || []} meta={result?.meta} />
    </div>
  );
};

export default Page;
