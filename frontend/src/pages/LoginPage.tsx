import LogInOutButton from "@/features/auth/components/LogInOutButton";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useContext } from "react";
import styles from "./styles/LoginPage.module.css";

function LoginPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.loginPage}>
      <LogInOutButton popoverTarget="video-management-login" />

      {user && (
        <div className={styles.userLinks}>
          <hr />
          <a href="/admin">Go to Admin Page</a>
          <a href="/upload">Go to Upload Page</a>
          <a href="/analysis">Go to Analysis Page</a>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
