import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

/**
 * Redirects already-authenticated users away from auth pages (login, register, forgot-password).
 * Drop this hook at the top of any auth page component.
 *
 * @param {string} to - destination path (default: "/dashboard")
 */
const useRedirectIfLoggedIn = (to = "/dashboard") => {
  const { currentUser } = useContext(AuthContext);
  const user = currentUser?.userData ?? null;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(to);
    }
  }, [user, navigate, to]);
};

export default useRedirectIfLoggedIn;