const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl text-zinc-100">
        <h1 className="text-3xl font-extrabold mb-4 text-white text-center sm:text-left">
          About the Project
        </h1>
        <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-6">
          This is a full-stack, secure video streaming platform designed to showcase modern web systems engineering. 
          It supports secure user login sessions, video uploads (with size constraints and user caps), automatic local storage folder generation, 
          and high-performance video streaming with range-request scrubbing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Backend Card */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 shadow-sm">
            <h3 className="text-xl font-bold text-blue-400 mb-3">Backend Architecture</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• <span className="text-white font-semibold">Node.js & Express:</span> Custom API and stream pipe controllers.</li>
              <li>• <span className="text-white font-semibold">TypeScript:</span> Strict static compiler checking.</li>
              <li>• <span className="text-white font-semibold">Mongoose / MongoDB:</span> Persisted database storage.</li>
              <li>• <span className="text-white font-semibold">Local Storage:</span> Streaming files directly to server disk.</li>
              <li>• <span className="text-white font-semibold">Zod & Helmet:</span> Request schema validations and headers security.</li>
              <li>• <span className="text-white font-semibold">Busboy:</span> Multipart parsing for chunked uploading.</li>
            </ul>
          </div>

          {/* Frontend Card */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 shadow-sm">
            <h3 className="text-xl font-bold text-purple-400 mb-3">Frontend Client</h3>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>• <span className="text-white font-semibold">React:</span> Modern component-based view layouts.</li>
              <li>• <span className="text-white font-semibold">Redux Toolkit:</span> State persistence for authentication tokens.</li>
              <li>• <span className="text-white font-semibold">Tailwind CSS:</span> Responsive utility styling.</li>
              <li>• <span className="text-white font-semibold">Axios:</span> Centralized HTTP client configurations.</li>
              <li>• <span className="text-white font-semibold">React-Dropzone:</span> Drag-and-drop file interface.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">
            Interested in viewing the source code or connecting? Use the links in the header!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
