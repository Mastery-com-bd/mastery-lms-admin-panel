import UpdateLiveClass from "@/components/dashboard/live-class/update/update-live-class";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsData = await params;
  const liveClassId = paramsData.id;

  return (
    <div>
      <UpdateLiveClass liveClassId={liveClassId} />
    </div>
  );
};

export default Page;
