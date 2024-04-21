import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
      <div className="flex items-center justify-center mb-4">
          <Home size={96} />
        </div>
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-700 mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
