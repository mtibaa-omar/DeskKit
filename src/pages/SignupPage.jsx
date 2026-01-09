import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import FormError from "../components/FormError";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import GoogleButton from "../features/auth/GoogleButton";
import { useSignup } from "../features/auth/useSignup";

export default function SignupPage() {
  const { isLoading: signupLoading, signup } = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    signup({
      email: data.email,
      password: data.password,
      userData: {
        full_name: data.fullName,
      },
    });
  };

  return (
    <div className="bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center gap-3 p-2 ">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-lg">
          <div className="w-full h-full rounded-xl flex items-center justify-center bg-white">
            <img
              src="/logo3.png"
              alt="DeskKit"
              className="w-10 h-10 rounded-lg"
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DeskKit
          </h1>
          <p className="text-sm text-gray-600">Your workspace companion</p>
        </div>
      </div>
      {/* Desktop Header */}
      <div className="bg-gray-50 hidden lg:flex  ">
        <div className="relative w-28 h-28 p-4">
          <img
            src="/logo3.png"
            alt="DeskKit"
            className="w-full h-full rounded-2xl object-contain drop-shadow-2xl"
          />
        </div>
      </div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 -mt-12 lg:-mt-28">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm">
            <GoogleButton mode="signup" />
            <FormError message={errors?.message} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input id="fullName" type="text" label="Full name" placeholder="Mtibaa omar" icon={User} error={errors.fullName?.message} {...register("fullName", { required: "Full name is required" })} />

              <Input id="email" type="email" label="Email" placeholder="votre.email@example.com" icon={Mail} error={errors.email?.message} {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email invalide",
                },
              })}
              />

              <Input id="password" type="password" label="Password" placeholder="••••••••" icon={Lock} error={errors.password?.message} hint={!errors.password ? "At least 8 characters" : undefined} {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "At least 8 characters",
                },
              })}
              />
              <Input id="confirmPassword" type="password" label="Confirm Password" placeholder="••••••••" icon={Lock} error={errors.confirmPassword?.message} hint={
                !errors.confirmPassword ? "At least 8 characters" : undefined
              } {...register("confirmPassword", {
                required: "Confirm Password is required",
                minLength: {
                  value: 8,
                  message: "At least 8 characters",
                },
                validate: (value) => {
                  if (value !== watch("password")) {
                    return "Passwords do not match";
                  }
                  return true;
                },
              })}
              />
              <Button type="submit" variant="primary" size="lg" icon={UserPlus} fullWidth isLoading={isSubmitting || signupLoading} loadingText="Creating account...">Create account</Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
