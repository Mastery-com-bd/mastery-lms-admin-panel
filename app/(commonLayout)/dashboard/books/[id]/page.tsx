import BookDetails from "@/components/dashboard/books/bookDetails/BookDetailsPage";
import { getASingleBook } from "@/service/books";
import { TBooks } from "@/types/product.types";

const BookDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getASingleBook(id);
  const book = (result?.data as TBooks) || {};
  return (
    <section>
      <BookDetails book={book} />
    </section>
  );
};

export default BookDetailsPage;
