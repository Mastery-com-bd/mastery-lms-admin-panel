import AllCategory from "@/components/dashboard/category/all/all-category";
import { getAllCategories } from "@/service/category";

type TSearchParams = Promise<{
  [key: string]: string | string[] | number | undefined;
}>;

const AllCategoryPage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const result = await getAllCategories(query);
  const categories = result?.data || [];
  const meta = result?.meta;

  return (
    <div>
      <AllCategory categories={categories} meta={meta} />
    </div>
  );
};

export default AllCategoryPage;
