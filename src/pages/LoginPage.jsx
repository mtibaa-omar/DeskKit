import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn, Mail, Lock } from "lucide-react";
import { useLogin } from "../features/auth/useLogin";
import FormError from "../components/FormError";
import Input from "../components/Input";
import Button from "../components/Button";
import AuthCard from "../features/auth/AuthCard";
import GoogleButton from "../features/auth/GoogleButton";

export default function LoginPage() {
  const { isLoading: loginLoading, login } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    login({ email: data.email, password: data.password });
  };


  return (
    <AuthCard title="Login" subtitle="Login to your account">
      <FormError message={errors.root?.message} />

      <GoogleButton mode="login" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input id="email" type="email" label="Email" placeholder="votre.email@example.com" icon={Mail} error={errors.email?.message} {...register("email", { required: "Email is required" })} />

        <Input id="password" type="password" label="Password" placeholder="••••••••" icon={Lock} error={errors.password?.message} {...register("password", { required: "Password is required" })} />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Remember me
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" icon={LogIn} fullWidth isLoading={isSubmitting || loginLoading} loadingText="Logging in...">Login</Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Sign Up
        </Link>
      </p>
    </AuthCard >
  );
}
