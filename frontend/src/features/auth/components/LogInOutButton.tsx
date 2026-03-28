import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoginPopup } from "./LoginPopup";

interface LoginOutProps {
    popoverTarget: string;
}

const LoginOut: React.FC<LoginOutProps> = ({ popoverTarget }) => {
    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            {user ? (
                <button onClick={handleLogout}>Log Out</button>
            ) : (
                <>
                    <button popoverTarget={popoverTarget} popoverTargetAction="show">Moderator-Login</button>
                    <LoginPopup popoverTarget={popoverTarget} />
                </>
            )}
        </>
    );

}

export default LoginOut;