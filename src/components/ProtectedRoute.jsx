import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../features/auth/useUser";
import SpinnerMini from "./SpinnerMini";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { data, isLoading, isAuthenticated } = useUser();

  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) return navigate("/login");
    },
    [isAuthenticated, isLoading, navigate]
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerMini />
      </div>
    );

  if (data === null) navigate("/login");
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
