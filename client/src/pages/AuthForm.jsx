import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:5000/login"
        : "http://localhost:5000/register";
      await axios.post(
        url,
        formData,
        { withCredentials: true } // Enable credentials for cookie handling
      );

      if (isLogin) {
        setMessage("Login successful!");
        navigate("/wall");
      } else {
        setMessage("Registration successful! Please log in.");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="h-screen">
      <div className="reenie-beanie-regular text-4xl border-b-[1px] border-gray-300 p-6">
        <h1>confessit!</h1>
      </div>

      <div className="flex flex-col items-center mt-32">
        <h1 className="reenie-beanie-regular text-5xl">
          what could possibly go wrong?
        </h1>
        <h1>Encrypt Your Confession. Only They Can Decode It.</h1>

        <form onSubmit={handleSubmit} className="flex gap-3 my-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Username"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-3 py-2"
            placeholder="Password"
            required
          />
          <button
            className="bg-black text-white text-sm rounded-lg px-3 py-2 content-center"
            type="submit"
          >
            {isLogin ? "Login" : "Sign\u00A0Up"}
          </button>
        </form>

        <p className="text-red-600">{message}</p>

        <button onClick={handleToggle}>
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <span style={{ textDecoration: "underline" }}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span style={{ textDecoration: "underline" }}>Login</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
