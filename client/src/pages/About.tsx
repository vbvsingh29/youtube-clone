import { Link } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";

const About = () => {
  return (
    <div className="relative py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:text-center">
          <h2 className="text-3xl font-bold leading-9 text-gray-900 mb-4">
            About
          </h2>
          <p className="text-lg leading-7 text-gray-600">
            Welcome to my video streaming project!
            {/* <span>
              {" "}
              <a
                href="https://github.com/your-username/your-repository"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline flex items-center ml-1"
              >
                {" "}
                Source Code
              </a>
            </span> */}
           {" "} It aims to provide a seamless experience for uploading and streaming
            videos, all powered by the latest technologies.
          </p>
          <p className="mt-4 text-lg leading-7 text-gray-600">
            To get started, simply register or login, and then upload your
            videos hassle-free.{" "}
            <Link to="/author" className="text-blue-500 hover:underline">
              Read about author
            </Link>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12">
        <h3 className="text-xl font-bold leading-8 text-gray-900 mb-2">
          Technologies Used
        </h3>
        <ul className="mt-2">
          <li className="text-lg leading-7 text-gray-600">
            <span className="font-bold">Backend:</span>
            <ul className="list-disc pl-6 mt-2">
              <li>Node.js and Express</li>
              <li>TypeScript</li>
              <li>Typegoose and Mongoose ORM for MongoDB</li>
              <li>Helmet for security</li>
              <li>Busboy for video streaming</li>
              <li>Zod for schema validation</li>
              <li>AWS SDK for storing images and videos on S3 bucket</li>
            </ul>
          </li>
          <li className="text-lg leading-7 text-gray-600 mt-4">
            <span className="font-bold">Frontend:</span>
            <ul className="list-disc pl-6 mt-2">
              <li>React and React-Redux for managing authentication tokens</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
