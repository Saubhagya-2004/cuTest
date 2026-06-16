import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message ?? "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-[28px] bg-white/90 p-6 shadow-xl ring-1 ring-slate-200"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-sky-700">
            Create Account
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Register
          </h1>
        </div>

        <label className="block">
          <div className="mb-1 text-sm text-slate-600">Email</div>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm text-slate-600">Password</div>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-slate-900 py-3 text-white disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create account"}
        </button>

        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-semibold text-sky-700 hover:text-sky-600" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

