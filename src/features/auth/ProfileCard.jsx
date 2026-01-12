import { GraduationCap, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileCard({ type = "loading", user }) {
  if (type === "loading") {
    return (
      <div className="p-5 border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="p-5 border-t border-white/10 shrink-0">
      <Link
        to="/account"
        className="flex items-center gap-4 p-4 rounded-xl bg-white/40 hover:bg-white/60 backdrop-blur-md border border-white/30 hover:border-white/50 transition-all group shadow-sm"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={
              user?.user_metadata?.fullName ||
              user?.user_metadata?.full_name ||
              "Avatar"
            }
            className="w-12 h-12 rounded-full object-cover shadow-md"
          />
        ) : (
          <img
            src="/default-user.jpg"
            className="w-12 h-12 rounded-full object-cover shadow-md"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-500 truncate">
            {user?.user_metadata?.fullName ||
              user?.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "My account"}
          </p>
        </div>
        <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:rotate-90 transition-all duration-300" />
      </Link>
    </div>
  );
}
