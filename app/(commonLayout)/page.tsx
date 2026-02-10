import AdminDashboard from "@/components/dashboard/dashboard";
import { getAdminReport } from "@/service/reports";

const Page = async () => {
  const report = await getAdminReport();

  return (
    <div>
      <AdminDashboard data={report.data} />
    </div>
  );
};

export default Page;
