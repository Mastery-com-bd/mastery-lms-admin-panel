import AllLiveClass from "@/components/dashboard/live-class/all/all-live-class"
import { getAllLiveClasses } from "@/service/live-class";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | number | undefined;
  }>;
}) => {
  const query = await searchParams;
  const result = await getAllLiveClasses(query);

  return (
    <div>
        <AllLiveClass liveClasses={result?.data || []} meta={result?.meta} />
    </div>
  )
}

export default Page