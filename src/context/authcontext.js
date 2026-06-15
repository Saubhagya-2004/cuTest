import { createContext, createElement, useState } from "react";

export const authcontext = createContext({
  user: {
    name: "Sarah Jenkins",
    role: "Engineering Lead",
  },
  setUser: () => {},
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: "Sarah Jenkins",
    role: "Engineering Lead",
  });

  return createElement(authcontext.Provider, { value: { user, setUser } }, children);
}
