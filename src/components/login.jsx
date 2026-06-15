import { Link } from "react-router-dom";

export default function Login() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="panel-surface w-full max-w-md rounded-[28px] border border-white/70 p-8 text-center shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Login</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Workspace access</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The task manager is ready from the dashboard route while auth screens are still being
          expanded.
        </p>
        <Link
          className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          to="/"
        >
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}
