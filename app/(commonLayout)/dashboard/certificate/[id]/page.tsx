import CertificateDetails from "@/components/dashboard/certificate/certificateDetails/CertificateDetails";

const CertificateDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  console.log(id);
  return (
    <section>
      <CertificateDetails />
    </section>
  );
};

export default CertificateDetailPage;
