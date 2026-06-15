import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Taskcard from "./Task/Taskcard";
import Taskform from "./Task/Taskform";
import { useAuth } from "../hooks/useAuth";
import {
  addTask,
  EMPTY_TASK,
  removeTask,
  subscribeToTasks,
  updateTask,
  updateTaskStatus,
} from "../services/Taskservice";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState("");
  const [formData, setFormData] = useState(EMPTY_TASK);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const unsubscribe = subscribeToTasks(
      user.uid,
      (taskList) => {
        setTasks(taskList);
        setLoading(false);
      },
      (firebaseError) => {
        setError(firebaseError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  const filteredTasks = tasks.filter((task) => {
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  });

  const resetForm = () => {
    setFormData(EMPTY_TASK);
    setEditingTaskId("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, formData);
      } else {
        await addTask(formData, user);
      }

      resetForm();
    } catch (taskError) {
      setError(taskError.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const handleDelete = async (taskId) => {
    setError("");

    try {
      await removeTask(taskId);

      if (editingTaskId === taskId) {
        resetForm();
      }
    } catch (taskError) {
      setError(taskError.message);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    setError("");

    try {
      await updateTaskStatus(taskId, status);

      if (editingTaskId === taskId) {
        setFormData((current) => ({
          ...current,
          status,
        }));
      }
    } catch (taskError) {
      setError(taskError.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-5xl">
        <Navbar onSearchChange={setSearchValue} searchValue={searchValue} />

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">{tasks.length}</h2>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">
              {tasks.filter((task) => task.status === "Completed").length}
            </h2>
          </div>

          <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">In Progress</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">
              {tasks.filter((task) => task.status === "In Progress").length}
            </h2>
          </div>
        </div>

        {error ? (
          <p className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <Taskform
            formData={formData}
            formLoading={formLoading}
            isEditing={Boolean(editingTaskId)}
            onCancel={resetForm}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
              <span className="text-sm text-gray-500">{filteredTasks.length} tasks</span>
            </div>

            {loading ? (
              <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                Loading tasks...
              </div>
            ) : null}

            {!loading && filteredTasks.length === 0 ? (
              <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
                No tasks found.
              </div>
            ) : null}

            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Taskcard
                  key={task.id}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onStatusChange={handleStatusChange}
                  task={task}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
