import { Link } from "react-router-dom";
import logo from "../public/youtube.png";
import { Search } from "lucide-react";
import UploadVideo from "../components/UploadVideo";
import { useMe } from "../../context/me";
import { useVideo } from "../../context/videos";
import { useState } from "react";

const Header = () => {
  const { user } = useMe();
  const { refetchVideos } = useVideo();
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetchVideos(searchVal);
  };

  return (
    <header className="bg-black text-white py-4 px-6 lg:px-8 shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={"/"}>   
            <img src={logo} className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to={"/"} className="hover:text-gray-400">
              Home
            </Link>
            <Link to={"/about"} className="hover:text-gray-400">
              About
            </Link>
          </nav>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-800 rounded-md px-3 py-1.5 w-60 sm:w-80 md:w-96">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="bg-transparent border-none text-white focus:outline-none w-full text-sm placeholder-gray-500"
          />
          <button type="submit" className="text-gray-400 hover:text-white ml-2">
            <Search size={18} />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <a
            href="mailto:vbvsingh2905@gmail.com"
            className="hidden sm:inline-block px-3 py-1.5 rounded-md border border-gray-600 text-sm font-medium text-white hover:bg-gray-800"
          >
            Contact Me
          </a>
          {!user && (
            <>
              <Link
                to={"/auth/login"}
                className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-800"
              >
                Login
              </Link>
              <Link
                to={"/auth/register"}
                className="px-3 py-1.5 text-sm rounded-md bg-blue-500 hover:bg-blue-600"
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
