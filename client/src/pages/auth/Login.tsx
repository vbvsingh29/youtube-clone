import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../api";
import { toast, Slide } from "react-toastify";
import { useMe } from "../../../context/me";

type loginInput = {
  email: string;
  password: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useMe();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginInput>();

  const onSubmit: SubmitHandler<loginInput> = async (data) => {
    try {
      const user = await login(data);
      console.log(user, "USER DETAILS");
      if (user) {
        console.log("cookie");
        document.cookie = `accessToken=${user}; max-age=31540000; path=/; secure; SameSite=None`;
      }
      setUser(user);
      navigate("/");
    } catch (error) {
      toast.error("Error, Invalid Credentials", {
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
          Log in to YouTube
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
                    message: "Password must be at least 6 characters",
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
          <button
            type="submit"
            className="bg-[#065fd4] hover:bg-[#0b499f] text-white font-medium py-2 px-4 rounded-md w-full"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
