import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { User, Mail, LogOut, Save } from "lucide-react";

import Input from "../components/Input";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useUser } from "../features/auth/useUser";
import { useLogout } from "../features/auth/useLogout";
import { useUpdateUser } from "../features/auth/useUpdateUser";


export default function ProfilePage() {
  const { user, isLoading: userLoading } = useUser();
  const { updateUser, isLoading: updateLoading } = useUpdateUser();
  const { isLoading: logoutLoading, logout } = useLogout();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
    },
  });


  useEffect(() => {
    if (user) {
      reset({
        fullName: user.user_metadata?.fullName || user.user_metadata?.full_name || user.email?.split("@")[0],
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/login");
    }
  }, [user, userLoading, navigate]);

  const onSubmit = async (data) => {
    updateUser({
      fullName: data.fullName,
    });
  };

  const handleSignOut = async () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };


  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" color="blue" className="mx-auto mb-4" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <Input
              label="Email"
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              icon={Mail}
              hint="Email cannot be modified"
            />

            <Input
              label="Full Name"
              id="fullName"
              placeholder="Ahmed Ben Ali"
              icon={User}
              {...register("fullName")}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Save}
              fullWidth
              isLoading={isSubmitting || updateLoading}
              loadingText="Saving..."
            >
              Save
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
