import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../api";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type registerInput = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<registerInput>();

  const onSubmit: SubmitHandler<registerInput> = async (data) => {
    try {
      toast.info("Creating account. Please wait...", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
      await registerUser(data);
      toast.success("Account has been created!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
      navigate("/auth/login");
    } catch (error) {
      toast.error("Error,Could not create account", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#f2f2f2]">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-[#030303]">
          Create your YouTube account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block font-medium mb-1 text-[#606060]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`border rounded-md px-3 py-2 w-full ${
                errors.email ? "border-[#cc0000]" : "border-[#d3d3d3]"
              }`}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-[#cc0000] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block font-medium mb-1 text-[#606060]"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`border rounded-md px-3 py-2 w-full ${
                errors.username ? "border-[#cc0000]" : "border-[#d3d3d3]"
              }`}
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-[#cc0000] mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block font-medium mb-1 text-[#606060]"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`border rounded-md px-3 py-2 w-full ${
                  errors.password ? "border-[#cc0000]" : "border-[#d3d3d3]"
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#606060] hover:text-[#030303]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#cc0000] mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block font-medium mb-1 text-[#606060]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`border rounded-md px-3 py-2 w-full ${
                  errors.confirmPassword
                    ? "border-[#cc0000]"
                    : "border-[#d3d3d3]"
                }`}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#606060] hover:text-[#030303]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[#cc0000] mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#065fd4] hover:bg-[#0b499f] text-white font-medium py-2 px-4 rounded-md w-full"
          >
            Create account
          </button>
        </form>
      </div>
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
    </div>
  );
};

export default Register;
