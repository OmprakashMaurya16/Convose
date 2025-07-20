import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";
import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItemClass = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      currentPath === path
        ? "bg-gray-800 text-blue-400"
        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
    }`;

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-700 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="text-2xl font-bold text-white">Converse</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link to="/" className={navItemClass("/")}>
          <HomeIcon className="size-5" />
          <span className="text-sm font-medium">Home</span>
        </Link>

        <Link to="/friends" className={navItemClass("/friends")}>
          <UsersIcon className="size-5" />
          <span className="text-sm font-medium">Friends</span>
        </Link>

        <Link to="/notification" className={navItemClass("/notification")}>
          <BellIcon className="size-5" />
          <span className="text-sm font-medium">Notifications</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={authUser?.profilePic}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-white truncate">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
