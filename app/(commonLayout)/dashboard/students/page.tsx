import AllStudent from "@/components/dashboard/students/allStudent";
import { getAllUsers } from "@/service/user";
import { TSearchParams } from "../categories/page";

const Page = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const userQuery = { ...query, role: "STUDENT" };
  const result = await getAllUsers(userQuery);
  const users = result?.data || [];
  const meta = result?.meta;

  return (
    <div>
      <AllStudent users={users} meta={meta} />
    </div>
  );
};

export default Page;
