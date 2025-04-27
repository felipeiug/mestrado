import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services";
import { useError } from "./ErrorContext";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
  status: boolean;
  university?: string;
  universityValid?: boolean;
  lastLogin?: Date;

  updateBy?: string;
  insertDate: Date;
  updateDate?: Date;
}


const UserContext = createContext<User | undefined>(undefined);

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider: React.FC<Props> = ({ children }) => {
  const api = useApi();
  const navigate = useNavigate();
  const setError = useError();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    api.user.getUser().then((user) => {
      if ("error" in user) {
        user.onClose = () => navigate("/login");
        setError(user);
        return;
      }

      setUser(user);
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

type Props = { children?: React.ReactNode; };