import AllBookscategories from "@/components/dashboard/books-categories/all-book-categories/AllBookscategories";
import { TSearchParams } from "../../categories/page";
import { getAllBookCategories } from "@/service/bookCategory";

const BooksCategoriesPage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const result = await getAllBookCategories(query);
  const categories = result?.data || [];
  const meta = result?.meta;
  return (
    <section>
      <AllBookscategories categories={categories} meta={meta} />
    </section>
  );
};

export default BooksCategoriesPage;
