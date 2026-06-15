import { STATUS_OPTIONS } from "../../services/Taskservice";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
};

export default function Taskcard({ task, onDelete, onEdit, onStatusChange }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{task.description || "No description"}</p>
        </div>

        <div className="flex gap-2">
          <button
            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
            onClick={() => onEdit(task)}
            type="button"
          >
            Edit
          </button>
          <button
            className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
            onClick={() => onDelete(task.id)}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          onChange={(event) => onStatusChange(task.id, event.target.value)}
          value={task.status}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {task.createdAt ? (
          <span className="text-sm text-gray-500">Added: {formatDate(task.createdAt)}</span>
        ) : null}
      </div>
    </div>
  );
}
