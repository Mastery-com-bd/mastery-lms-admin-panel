import AdminDashboard from "@/components/dashboard/dashboard";
import { getAdminReport } from "@/service/reports";

const Page = async () => {
  const result = await getAdminReport();
  const report = result?.data || {};
  return (
    <div>
      <AdminDashboard data={report} />
    </div>
  );
};

export default Page;
