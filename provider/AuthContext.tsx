"use client";

import { getCurrentUser } from "@/service/auth";
import { TUser } from "@/types/user.types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type exportProviderValue = {
  user: TUser | null;
  isLoading: boolean;
  setUser: (user: TUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<exportProviderValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) return;
    Promise.resolve().then(() => {
      handleUser();
    });
  }, [isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        refetchUser: handleUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("user user can be used only within the Use provider hook");
  }
  return context;
};

export default AuthProvider;
