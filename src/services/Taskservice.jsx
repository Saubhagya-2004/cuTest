const STORAGE_KEY = "taskflow.workspace.tasks";

export const STATUS_ORDER = ["Backlog", "In Progress", "Review", "Done"];
export const PRIORITY_ORDER = ["Critical", "High", "Medium", "Low"];

export const EMPTY_TASK = {
  title: "",
  description: "",
  assignee: "",
  team: "Engineering Team",
  priority: "Medium",
  status: "Backlog",
  dueDate: "",
  tags: [],
};

const seedTasks = [
  {
    id: "task-101",
    title: "Complete response task audience",
    description: "Refine the onboarding story so engineering can ship the new workspace view confidently.",
    assignee: "Sarah Jenkins",
    team: "Engineering Team",
    priority: "High",
    status: "Backlog",
    dueDate: "2026-06-18",
    tags: ["Onboarding", "Docs"],
    createdAt: "2026-06-10T09:00:00.000Z",
    updatedAt: "2026-06-10T09:00:00.000Z",
  },
  {
    id: "task-102",
    title: "Configure desktop project management",
    description: "Finalize the board interactions and validate drag-free status updates for the first release.",
    assignee: "Maya Patel",
    team: "Engineering Team",
    priority: "Critical",
    status: "In Progress",
    dueDate: "2026-06-16",
    tags: ["Sprint 4", "Board"],
    createdAt: "2026-06-11T10:00:00.000Z",
    updatedAt: "2026-06-14T15:30:00.000Z",
  },
  {
    id: "task-103",
    title: "Audit customer insights for issue queue",
    description: "Group high-friction feedback into issue themes before the sprint review.",
    assignee: "Jordan Lee",
    team: "Product Team",
    priority: "Medium",
    status: "Review",
    dueDate: "2026-06-17",
    tags: ["Research"],
    createdAt: "2026-06-12T13:30:00.000Z",
    updatedAt: "2026-06-13T12:15:00.000Z",
  },
  {
    id: "task-104",
    title: "Ship workspace navbar polish",
    description: "Match the navbar spacing, avatar cluster, and create-task CTA to the design reference.",
    assignee: "Alex Morgan",
    team: "Design Team",
    priority: "High",
    status: "Done",
    dueDate: "2026-06-14",
    tags: ["UI", "Navbar"],
    createdAt: "2026-06-08T08:20:00.000Z",
    updatedAt: "2026-06-14T11:00:00.000Z",
  },
  {
    id: "task-105",
    title: "Review blockers before standup",
    description: "Confirm deployment dependencies and surface any blockers that need product support.",
    assignee: "Nina Brooks",
    team: "Engineering Team",
    priority: "Critical",
    status: "Backlog",
    dueDate: "2026-06-15",
    tags: ["Standup", "Risk"],
    createdAt: "2026-06-15T05:30:00.000Z",
    updatedAt: "2026-06-15T05:30:00.000Z",
  },
  {
    id: "task-106",
    title: "Prepare sprint handoff notes",
    description: "Summarize open tasks, due dates, and owners for the next planning session.",
    assignee: "Sarah Jenkins",
    team: "Operations Team",
    priority: "Low",
    status: "In Progress",
    dueDate: "2026-06-20",
    tags: ["Planning"],
    createdAt: "2026-06-13T08:00:00.000Z",
    updatedAt: "2026-06-14T09:45:00.000Z",
  },
];

const canUseStorage = typeof window !== "undefined" && window.localStorage;

const toTagList = (value) => {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const normalizeTask = (task) => {
  const now = new Date().toISOString();

  return {
    ...EMPTY_TASK,
    ...task,
    tags: toTagList(task?.tags),
    createdAt: task?.createdAt ?? now,
    updatedAt: task?.updatedAt ?? now,
  };
};

const writeTasks = (tasks) => {
  const normalizedTasks = tasks.map(normalizeTask);

  if (canUseStorage) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedTasks));
  }

  return normalizedTasks;
};

const readTasks = () => {
  if (!canUseStorage) {
    return seedTasks.map(normalizeTask);
  }

  const rawTasks = window.localStorage.getItem(STORAGE_KEY);

  if (!rawTasks) {
    return writeTasks(seedTasks);
  }

  try {
    const parsedTasks = JSON.parse(rawTasks);

    if (!Array.isArray(parsedTasks) || parsedTasks.length === 0) {
      return writeTasks(seedTasks);
    }

    return parsedTasks.map(normalizeTask);
  } catch {
    return writeTasks(seedTasks);
  }
};

const createId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `task-${Date.now()}`;
};

export const getTasks = async () => {
  return readTasks();
};

export const createTask = async (task) => {
  const nextTask = normalizeTask({
    ...task,
    id: createId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  writeTasks([nextTask, ...readTasks()]);

  return nextTask;
};

export const updateTask = async (id, task) => {
  const updatedTasks = readTasks().map((item) => {
    if (item.id !== id) {
      return item;
    }

    return normalizeTask({
      ...item,
      ...task,
      id,
      updatedAt: new Date().toISOString(),
    });
  });

  writeTasks(updatedTasks);

  return updatedTasks.find((item) => item.id === id) ?? null;
};

export const deleteTask = async (id) => {
  const updatedTasks = readTasks().filter((item) => item.id !== id);

  writeTasks(updatedTasks);

  return updatedTasks;
};
