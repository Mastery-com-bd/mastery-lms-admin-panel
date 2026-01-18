import { ReactNode } from "react";
import AuthProvider from "./AuthContext";

const Provider = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Provider;
