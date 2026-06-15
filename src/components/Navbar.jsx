import { FiBell, FiChevronDown, FiHelpCircle, FiPlus, FiSearch } from "react-icons/fi";
import { LuCheckCheck } from "react-icons/lu";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({
  notificationCount,
  onCreateTask,
  onSearchChange,
  searchValue,
  selectedTeam,
  teamOptions,
  onTeamChange,
}) {
  const { user } = useAuth();

  return (
    <header className="panel-surface sticky top-4 z-30 rounded-[28px] border border-white/80 px-4 py-4 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur md:px-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(30,41,59,0.08)]">
          <div className="taskflow-logo">
            <LuCheckCheck className="text-lg text-white" />
          </div>
          <div>
            <p className="text-xl font-semibold tracking-tight text-slate-950">TaskFlow</p>
          </div>
        </div>

        <div className="hidden h-10 w-px bg-slate-200 md:block" />

        <label className="relative min-w-[220px] flex-1 md:max-w-[210px]">
          <select
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-900"
            onChange={(event) => onTeamChange(event.target.value)}
            value={selectedTeam}
          >
            {teamOptions.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </label>

        <label className="relative min-w-[260px] flex-[999]">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 pr-20 text-sm text-slate-700 outline-none transition focus:border-slate-900"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks, projects, or people..."
            value={searchValue}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold tracking-[0.18em] text-slate-400">
            Ctrl K
          </span>
        </label>

        <button
          className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#4158d0,#3146b1)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(65,88,208,0.32)] transition hover:-translate-y-0.5"
          onClick={onCreateTask}
          type="button"
        >
          <FiPlus />
          Create Task
        </button>

        <button
          className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          type="button"
        >
          <FiBell />
          {notificationCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          ) : null}
        </button>

        <button
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          type="button"
        >
          <FiHelpCircle />
        </button>

        <button
          className="ml-auto inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left shadow-[0_10px_25px_rgba(30,41,59,0.07)] transition hover:border-slate-400"
          type="button"
        >
          <div className="relative">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#f2d7c1,#d29d82)] text-sm font-semibold text-slate-900">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
          <FiChevronDown className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}
