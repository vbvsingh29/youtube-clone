import { Link } from "react-router-dom";
import logo from "../public/youtube.png";
import { Menu } from "lucide-react";
import UploadVideo from "../components/UploadVideo";
import { useMe } from "../../context/me";

const Header = () => {
  const { user } = useMe();

  return (
    <header className="bg-black text-white py-4 px-6 lg:px-8 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="lg:hidden">
            <Menu />
          </button>
          <Link to={"/"}>
            <img src={logo} className="h-8" />
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link to={"/"} className="hover:text-gray-400">
              Home
            </Link>
            <Link to={"/about"} className="hover:text-gray-400">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link
                to={"/auth/login"}
                className="px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                to={"/auth/register"}
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600"
              >
                Register
              </Link>
            </>
          )}
          {user && <UploadVideo />}
        </div>
      </div>
    </header>
  );
};

export default Header;
