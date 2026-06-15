import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(name, email, password);
      navigate("/dashboard");
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        className="w-full max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-1 text-2xl font-bold text-gray-800">Register</h1>
        <p className="mb-6 text-sm text-gray-600">Create account first, then dashboard will show.</p>

        {error ? (
          <p className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            id="name"
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter name"
            required
            type="text"
            value={name}
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email"
            required
            type="email"
            value={email}
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
            type="password"
            value={password}
          />
        </div>

        <button
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have account?{" "}
          <Link className="text-blue-600 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
