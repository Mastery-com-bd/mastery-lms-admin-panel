import { AllSupportRequest } from "@/components/dashboard/supports/all-support-request";
import { getAllSupportRequests } from "@/service/support";
import { TSearchParams } from "../categories/page";

const Page = async ({ searchParams }: { searchParams: TSearchParams }) => {
  const query = await searchParams;
  const result = await getAllSupportRequests(query);
  const supportRequests = result?.data || [];
  const meta = result?.meta;

  return (
    <div>
      <AllSupportRequest supportRequests={supportRequests} meta={meta} />
    </div>
  );
};

export default Page;
