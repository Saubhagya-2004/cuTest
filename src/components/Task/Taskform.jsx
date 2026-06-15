import { STATUS_OPTIONS } from "../../services/Taskservice";

export default function Taskform({
  formData,
  formLoading,
  isEditing,
  onCancel,
  onChange,
  onSubmit,
}) {
  return (
    <form
      className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
      onSubmit={onSubmit}
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        {isEditing ? "Update Task" : "Add Task"}
      </h2>

      <div className="mb-3">
        <label className="mb-1 block text-sm text-gray-700" htmlFor="title">
          Title
        </label>
        <input
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          id="title"
          name="title"
          onChange={onChange}
          placeholder="Enter task title"
          required
          value={formData.title}
        />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-sm text-gray-700" htmlFor="description">
          Description
        </label>
        <textarea
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          id="description"
          name="description"
          onChange={onChange}
          placeholder="Enter task description"
          rows="3"
          value={formData.description}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm text-gray-700" htmlFor="status">
          Status
        </label>
        <select
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
          id="status"
          name="status"
          onChange={onChange}
          value={formData.status}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
          disabled={formLoading}
          type="submit"
        >
          {formLoading ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
        </button>

        {isEditing ? (
          <button
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
