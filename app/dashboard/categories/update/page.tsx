import UpdateCategory from "@/components/dashboard/category/update/update-course";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [id: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const categoryId = params.id as string | undefined;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/category/${categoryId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category");
  }

  const { data } = await response.json();
  
  return (
    <div>
      <UpdateCategory category={data} id={categoryId} />
    </div>
  );
};

export default Page;
