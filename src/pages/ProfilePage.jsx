import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { User, Mail, LogOut, Save, Camera } from "lucide-react";

import Input from "../components/Input";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useUser } from "../features/auth/useUser";
import { useLogout } from "../features/auth/useLogout";
import { useUpdateUser } from "../features/auth/useUpdateUser";
import { COLOR_SCHEMES } from "../styles/colorSchemes";


export default function ProfilePage() {
  const { user, isLoading: userLoading } = useUser();
  const { updateUser, isUpdating: updateLoading } = useUpdateUser();
  const { isLoading: logoutLoading, logout } = useLogout();
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

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
        fullName: user.user_metadata?.fullName || user.user_metadata?.full_name || "",
      });
      setAvatarPreview(user.user_metadata?.avatar);
    }
  }, [user, reset]);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/login");
    }
  }, [user, userLoading, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPG, PNG, GIF, or WebP)');
      return;
    }

    const maxSize = 1 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image must be less than 1MB');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    updateUser({
      fullName: data.fullName,
      avatar: avatarFile,
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
        <Spinner size="xl" color="blue" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-white h-[calc(100vh-4rem)] rounded-2xl ">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-12">
          <div className={`p-3 rounded-2xl ${COLOR_SCHEMES.blue.bgLight}`}>
            <User className={`w-8 h-8 text-blue-500`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-500 mt-1">Manage your profile and account preferences</p>
          </div>
          <Button
              type="button"
              variant="danger"
              size="lg"
              icon={LogOut}
              isLoading={logoutLoading}
              onClick={handleSignOut}
              className="ml-auto px-6"
              >Sign Out</Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-gray-400" />
              Profile Picture
            </h2>
            
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-300" />
                  )}
                </div>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-1 right-1 p-2.5 bg-white rounded-full shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all hover:scale-105"
                >
                  <Camera className="w-5 h-5 text-blue-600" />
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Change avatar</p>
                <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                <button 
                  type="button" 
                  onClick={() => document.getElementById('avatar-upload').click()}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Upload new image
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                id="fullName"
                placeholder="Mtibaa Omar"
                icon={User}
                {...register("fullName")}
              />
              <Input
                label="Email Address"
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                icon={Mail}
                hint="Used for login and security"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Save}
              isLoading={isSubmitting || updateLoading}
              loadingText="Saving changes..."
              className="flex-1"
            >
              Update Profile
            </Button>
            
            
          </div>
        </form>
      </div>
    </div>
  );
}
