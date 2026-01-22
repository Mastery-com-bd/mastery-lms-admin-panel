import AllBooks from "@/components/dashboard/books/all-books/AllBooksPage";
import { TSearchParams } from "../categories/page";
import { getAllBooks } from "@/service/books";

const AllBooksPage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const result = await getAllBooks(query);
  const books = result?.data?.products?.data || [];
  const meta = result?.data?.products?.meta;
  const categories = result?.data?.categories?.data || [];

  return (
    <section>
      <AllBooks books={books} categories={categories} meta={meta} />
    </section>
  );
};

export default AllBooksPage;
