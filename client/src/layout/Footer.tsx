import { useState } from "react";
import { Heart } from "lucide-react";

const Footer = () => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-black text-white py-4 px-6 flex justify-center items-center">
      <div className="flex items-center">
        <span className="flex items-center hover:text-red-500 transition-colors duration-300 cursor-pointer" onClick={handleHeartClick}>
          <Heart
            className={`w-5 h-5 mr-2 duration-300 bg-red ${
              isHeartFilled ? "text-red-500" : "text-gray-400"
            }`}
          />
          Made with love
        </span>
      </div>
    </footer>
  );
};

export default Footer;