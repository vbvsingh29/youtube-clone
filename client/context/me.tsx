import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { getMe } from "../api";
import { Me } from "../types";

const MeContext = createContext<{
  user: Me;
  setUser: (user: Me | null) => void;
}>({ user: null, setUser: () => {} });

function MeContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getMe();
      setUser(userData);
    }
    fetchUser();
  }, []);

  return (
    <MeContext.Provider value={{ user, setUser }}>
      {children}
    </MeContext.Provider>
  );
}

const useMe = () => useContext(MeContext);

export { MeContextProvider, useMe };
