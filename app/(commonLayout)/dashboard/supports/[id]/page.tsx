import SupportDetails from "@/components/dashboard/supports/SupportDetails";
import { getSupportRequestById } from "@/service/support";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const result = await getSupportRequestById(id);
  const supportRequest = result?.data;

  return (
    <div>
      {/* <SupportDetails initialData={supportRequest} /> */}
      Support Details
    </div>
  );
};

export default Page;
