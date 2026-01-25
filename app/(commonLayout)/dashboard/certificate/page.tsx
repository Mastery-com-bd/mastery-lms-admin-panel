import AllCertificate from "@/components/dashboard/certificate/allCertificate/AllCertificate";
import { TSearchParams } from "../categories/page";
import { getAllCertificates } from "@/service/certificate";

const AllCertificatePage = async ({
  searchParams,
}: {
  searchParams: TSearchParams;
}) => {
  const query = await searchParams;
  const result = await getAllCertificates(query);
  console.log(result);

  const certificates = result?.data || [];
  const meta = result?.meta || {};

  return (
    <section>
      <AllCertificate certificates={certificates} meta={meta} />
    </section>
  );
};

export default AllCertificatePage;
