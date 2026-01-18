"use client";

import { Button } from "../ui/button";

const Logout = () => {
  const handleLogOut = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    console.log(await response.json());
  };
  return (
    <div>
      <Button onClick={handleLogOut}>Log Out</Button>
    </div>
  );
};

export default Logout;
