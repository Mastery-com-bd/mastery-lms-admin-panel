import UpdateLiveClass from "@/components/dashboard/live-class/update/update-live-class";
import { getLiveClassById } from "@/service/live-class";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsData = await params;
  const liveClassId = paramsData.id;
  const response = await getLiveClassById(liveClassId);
  const liveClass = response.data || response;

  return (
    <div>
      <UpdateLiveClass liveClassId={liveClassId} initialData={liveClass} />
    </div>
  );
};

export default Page;
