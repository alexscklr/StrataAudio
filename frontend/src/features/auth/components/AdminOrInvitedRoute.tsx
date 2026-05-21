import { type ReactNode, useContext, useEffect, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface AdminOrInvitedRouteProps {
  children: ReactNode;
  inviteStorageKey: string;
  inviteQueryParam?: string;
  redirectTo?: string;
}

export const AdminOrInvitedRoute = ({
  children,
  inviteStorageKey,
  inviteQueryParam = "invite",
  redirectTo = "/login",
}: AdminOrInvitedRouteProps) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const inviteTokenFromQuery = useMemo(() => {
    const token = new URLSearchParams(location.search).get(inviteQueryParam)?.trim() ?? "";
    return token;
  }, [location.search, inviteQueryParam]);

  const inviteTokenFromStorage = useMemo(() => {
    const token = sessionStorage.getItem(inviteStorageKey)?.trim() ?? "";
    return token;
  }, [inviteStorageKey]);

  const hasInviteAccess = inviteTokenFromQuery.length > 0 || inviteTokenFromStorage.length > 0;

  useEffect(() => {
    if (inviteTokenFromQuery.length === 0) {
      return;
    }

    sessionStorage.setItem(inviteStorageKey, inviteTokenFromQuery);

    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(inviteQueryParam);
    const nextSearch = searchParams.toString();

    navigate(
      {
        pathname: location.pathname,
        search: nextSearch.length > 0 ? `?${nextSearch}` : "",
        hash: location.hash,
      },
      { replace: true },
    );
  }, [inviteQueryParam, inviteStorageKey, inviteTokenFromQuery, location.hash, location.pathname, location.search, navigate]);

  if (loading) {
    return null;
  }

  if (user || hasInviteAccess) {
    return children;
  }

  return <Navigate to={redirectTo} replace />;
};