import { Link, useLocation } from "react-router-dom";
import { BellIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser.js";
import useLogout from "../hooks/useLogout.js";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">
          {isChatPage ? (
            <Link
              to="/"
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              Converse
            </Link>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Link to="/notification">
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <BellIcon className="h-5 w-5 text-gray-300" />
              </button>
            </Link>

            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={() => logoutMutation()}
              className="px-3 py-1.5 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
