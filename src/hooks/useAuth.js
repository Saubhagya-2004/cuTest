import { useContext } from "react";
import { authcontext } from "../context/authcontext";

export const useAuth = () => {
  return useContext(authcontext);
};
