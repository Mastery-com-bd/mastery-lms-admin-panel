import UpdateSection from "@/components/dashboard/section/update-section/update-section";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      <UpdateSection sectionId={id} />
    </div>
  );
};

export default Page;
