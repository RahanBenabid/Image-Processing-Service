import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../assets/sign_inout/bg1.png";
import robot from "../assets/robot.png";
import { benefits } from "../constants";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const RespRadius = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) {
        return 7;
      } else if (width < 1024) {
        return 9;
      } else {
        return 11;
      }
    }
    return 11;
  };

  const [radius, setRadius] = useState(11);
  React.useEffect(() => {
    const handleResize = () => {
      setRadius(RespRadius());
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (obj) => {
    obj.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting login with:", { email });
      const user = await login(email, password);
      console.log("Login successful, user data:", user);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error in component:", err);
      setError(
        err.message || "Failed to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center lg:justify-around bg-cover bg-center py-10 px-6 lg:px-16 xl:px-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-[450px] p-6 md:p-8 mb-12 lg:mb-0 order-2 lg:order-1">
        <h1 className="text-3xl md:text-4xl text-white font-bold text-center mb-6">
          Login
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white px-4 py-2 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="relative my-6 md:my-8">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Email
            </label>
          </div>
          <div className="relative my-6 md:my-8">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-500 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Password
            </label>
          </div>
          <div className="flex justify-between items-center mt-6 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="remember" className="text-white text-sm">
                Remember Me
              </label>
            </div>
            <span className="text-white text-sm hover:text-blue-500 cursor-pointer">
              Forgot Password?
            </span>
          </div>
          <style>
            {`
                    @keyframes gradientAnimation {
                        0% { background-position: 0% 50% }
                        50% { background-position: 100% 50% }
                        100% { background-position: 0% 50% }
                    }
                `}
          </style>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-2 rounded-full transition-colors duration-300 text-lg font-medium relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, #858dff, #ff98e2, #7adb78, #ff776f, #ffc876, #ac6aff)",
              backgroundSize: "600% 600%",
              animation: "gradientAnimation 10s ease infinite",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center mt-6">
            <span className="text-white text-sm">
              New Here?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Create an Account
              </Link>{" "}
            </span>
          </div>
        </form>
      </div>

      <div className="relative flex w-[18rem] sm:w-[20rem] lg:w-[22rem] aspect-square border border-n-6 rounded-full mx-auto lg:mx-0 order-1 lg:order-2">
        <div className="flex w-[70%] aspect-square m-auto border border-n-6 rounded-full">
          <div className="w-[65%] aspect-square m-auto p-[0.2rem] bg-conic-gradient rounded-full">
            <div className="flex items-center justify-center w-full h-full bg-n-8 rounded-full">
              <img src={robot} className="w-[75%] h-auto" alt="robot" />
            </div>
          </div>
        </div>

        <ul className="absolute w-full h-full top-0 left-0">
          {benefits.map((item, index) => {
            const angle = index * (360 / benefits.length);
            return (
              <li
                key={item.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-400 hover:scale-110"
                style={{
                  left: `calc(59% + ${Math.cos(angle * (Math.PI / 180)) * radius}rem)`,
                  top: `calc(59% + ${Math.sin(angle * (Math.PI / 180)) * radius}rem)`,
                  animation: `float${index} 3s ease-in-out infinite alternate`,
                }}
              >
                <div className="flex w-[2.6rem] sm:w-[3.2rem] h-[2.6rem] sm:h-[3.2rem] bg-black/50 backdrop-blur-sm border border-white/20 rounded-full shadow-lg transition-all duration-300 hover:border-blue-400/50 hover:shadow-blue-400/20">
                  <img
                    className="m-auto w-5 h-5 sm:w-6 sm:h-6"
                    alt={item.title}
                    src={item.icon}
                  />
                </div>
              </li>
            );
          })}
        </ul>

        <style>
          {benefits
            .map(
              (item, index) => `
            @keyframes float${index} {
              0% { transform: translate(-50%, -50%) translateY(0); }
              100% { transform: translate(-50%, -50%) translateY(-5px); }
            }
          `,
            )
            .join("")}
          {`
            @media (max-width: 640px) {
              .orbit-icon-sm {
                --orbit-radius: 7rem;
              }
            }
            @media (min-width: 641px) and (max-width: 1023px) {
              .orbit-icon-md {
                --orbit-radius: 9rem;
              }
            }
            @media (min-width: 1024px) {
              .orbit-icon-lg {
                --orbit-radius: 11rem;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Login;
