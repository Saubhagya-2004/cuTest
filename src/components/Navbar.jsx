import { useAuth } from "../hooks/useAuth";

export default function Navbar({ onSearchChange, searchValue }) {
  const { user, logoutUser } = useAuth();

  return (
    <header className="mb-6 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">TaskFlow</h1>
          <p className="text-sm text-gray-600">
            {user?.displayName || user?.email || "User"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search task"
            value={searchValue}
          />

          <button
            className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
            onClick={logoutUser}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
