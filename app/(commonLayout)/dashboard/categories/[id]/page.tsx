import CategoryDetails from "@/components/dashboard/category/categoryDetails/CategoryDetails";
import { getCategoryById } from "@/service/category";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsData = await params;
  const categoryId = paramsData.id;
  const result = await getCategoryById(categoryId);
  const category = result?.data;

  return (
    <div>
      <CategoryDetails category={category} />
    </div>
  );
};

export default Page;
