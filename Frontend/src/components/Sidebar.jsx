import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";
import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItemClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 group ${
      currentPath === path
        ? "bg-[#3a3a4f] text-white border border-[#545466]"
        : "text-gray-400 hover:bg-[#2d2d40] hover:text-white hover:border hover:border-[#444455]"
    }`;

  return (
    <aside className="w-64 bg-[#1f1f2e] border-r border-[#2e2e3e] hidden lg:flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-[#2e2e3e] bg-[#252536]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 tracking-wider drop-shadow-lg transition-transform duration-300 hover:scale-105">
            Converse
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className={navItemClass("/")}>
          <HomeIcon className="size-5 text-blue-400" />
          <span className="text-sm font-medium">Home</span>
        </Link>

        <Link to="/friends" className={navItemClass("/friends")}>
          <UsersIcon className="size-5 text-purple-400" />
          <span className="text-sm font-medium">Friends</span>
        </Link>

        <Link to="/notification" className={navItemClass("/notification")}>
          <BellIcon className="size-5 text-pink-400" />
          <span className="text-sm font-medium">Notifications</span>
        </Link>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-[#2e2e3e] mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-white truncate">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-success flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-success inline-block animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
