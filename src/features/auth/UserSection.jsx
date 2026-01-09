import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { useUser } from "./useUser";
import ProfileCard from "./ProfileCard";

export function UserSection() {
  const { user, isLoading: userLoading } = useUser();
  if (userLoading) {
    return (
      <ProfileCard type='loading' />
    );
  }

  if (!user) {
    return (
      <div className="p-5 border-t border-gray-100 shrink-0">
        <div className="space-y-2">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Signup</span>
          </Link>
        </div>
      </div>
    );
  }

  // Logged in 
  return (
    <ProfileCard type='user' user={user} />
  );
}

export default UserSection;
