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
  const result = await getAllSections(query);

  return (
    <div>
      <AllSection sections={result?.data || []} meta={result?.meta} />
    </div>
  );
};

export default Page;
