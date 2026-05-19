import LogInOutButton from "@/features/auth/components/LogInOutButton";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useContext } from "react";

function LoginPage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <LogInOutButton popoverTarget="video-management-login" />

      {user && (
        <>
          <hr />
          <a href="/admin">Go to Admin Page</a>
          <a href="/upload">Go to Upload Page</a>
        </>
      )}
    </div>
  );
}

export default LoginPage;
