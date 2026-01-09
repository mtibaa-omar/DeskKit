import { useQuery } from "@tanstack/react-query";
import { authAPI } from "../../services/api/apiAuth";
import { authKeys } from "./authKeys";

export function useSession() {
    return useQuery({
        queryKey: authKeys.session,
        queryFn: authAPI.getSession,
        retry: false,
    });
}
