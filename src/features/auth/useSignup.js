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
        onSuccess: (data, variables) => {
            if (data?.session) {
                queryClient.invalidateQueries({ queryKey: authKeys.user });
                queryClient.invalidateQueries({ queryKey: authKeys.session });
                toast.success("Account created successfully!");
                navigate("/", { replace: true });
            } else {
                navigate("/confirm-email", { state: { email: variables.email } });
            }
        },
        onError: (err) => {
            const message = err.message || "Error during registration";
            toast.error(message);
        },
    });

    return { isLoading, signup };
}
