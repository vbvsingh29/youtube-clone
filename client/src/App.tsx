import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "./layout/Footer";
import Home from "./pages/Home";
import Header from "./layout/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { MeContextProvider } from "../context/me";
import { VideoContextProvider } from "../context/videos";
import WatchVideo from "./pages/watch/WatchVideo";
import About from "./pages/About";

const App = () => (
  <BrowserRouter>
    <MeContextProvider>
      <VideoContextProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/" element={<About />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/watch/:query" element={<WatchVideo />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-center"
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </VideoContextProvider>
    </MeContextProvider>
  </BrowserRouter>
);

export default App;
