import { useMoveBack } from "../hooks/useMoveBack";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-12">
          <div className="flex flex-row justify-center">

            <div className="mb-6">
              <h1 className="text-9xl sm:text-[12rem] font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
                404
              </h1>
            </div>

            <div className="">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 animate-bounce">
                <Search className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4  text-center">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={moveBack} className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <Link to="/">
              <Button variant="outline-secondary" icon={Home}>Home Page</Button>
            </Link>
          </div>
        </div>

        <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl rotate-12 animate-pulse opacity-80"></div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full animate-bounce opacity-80"></div>
      </div>
    </div>
  );
}

export default PageNotFound;
