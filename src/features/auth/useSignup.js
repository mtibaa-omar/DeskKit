import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../../services/api/apiAuth";
import { authKeys } from "./authKeys";

export function useSignup() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isPending: isLoading, mutate: signup } = useMutation({
        mutationFn: ({ email, password, userData }) =>
            authAPI.signUp(email, password, userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.user });
            queryClient.invalidateQueries({ queryKey: authKeys.session });
            toast.success("Account created successfully!");
            navigate("/", { replace: true });
        },
        onError: (err) => {
            const message = err.message || "Error during registration";
            toast.error(message);
        },
    });

    return { isLoading, signup };
}
