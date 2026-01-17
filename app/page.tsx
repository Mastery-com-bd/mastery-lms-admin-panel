import { redirect } from "next/navigation";

const Page = () => {
  redirect("/auth/login");
  return <div>Home Pagek</div>;
};

export default Page;
