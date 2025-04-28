import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../services";
import { useError } from "./ErrorContext";
import { useNavigate } from "react-router-dom";
import { useAppThemeContext } from "./ThemeContext";

export interface User {
  id: string;
  name: string;
  email: string;
  admin: boolean;
  status: boolean;
  theme?: boolean;
  lastLogin?: Date;
  university?: string;
  universityValid?: boolean;
  lastResetPassword?: Date;
  resetPasswordCode?: string;

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
  const setError = useError();
  const navigate = useNavigate();
  const { toggleTheme } = useAppThemeContext();

  const [user, setUser] = useState<User>();

  useEffect(() => {
    api.user.getUser().then((user) => {
      if ("error" in user) {
        user.onClose = () => navigate("/login");
        setError(user);
        return;
      }
      toggleTheme(user.theme ?? false);
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