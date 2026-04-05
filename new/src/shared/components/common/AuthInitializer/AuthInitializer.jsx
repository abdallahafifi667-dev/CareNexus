import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../../../pages/Auth/stores/authService";

/**
 * AuthInitializer
 * Mounted once at the root of the app.
 * Restores user session from localStorage and verifies it with the backend.
 */
const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth-token");

    // Only verify if we have a token but state is not yet hydrated or needs re-verification
    if (savedToken && !user) {
      dispatch(verifyToken());
    }
  }, [dispatch, user]);

  return null;
};

export default AuthInitializer;
