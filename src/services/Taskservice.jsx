import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

export const EMPTY_TASK = {
  title: "",
  description: "",
  status: "Pending",
};

const taskCollection = collection(db, "tasks");

const formatTask = (taskDocument) => {
  const data = taskDocument.data();

  return {
    id: taskDocument.id,
    title: data.title || "",
    description: data.description || "",
    status: data.status || "Pending",
    userId: data.userId || "",
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || "",
  };
};

export const subscribeToTasks = (userId, onTasks, onError) => {
  const taskQuery = query(taskCollection, where("userId", "==", userId));

  return onSnapshot(
    taskQuery,
    (snapshot) => {
      const taskList = snapshot.docs
        .map(formatTask)
        .sort((firstTask, secondTask) => {
          return (
            (new Date(secondTask.createdAt).getTime() || 0) -
            (new Date(firstTask.createdAt).getTime() || 0)
          );
        });

      onTasks(taskList);
    },
    onError,
  );
};

export const addTask = async (taskData, user) => {
  await addDoc(taskCollection, {
    title: taskData.title.trim(),
    description: taskData.description.trim(),
    status: taskData.status,
    userId: user.uid,
    userEmail: user.email || "",
    createdAt: serverTimestamp(),
  });
};

export const updateTask = async (taskId, taskData) => {
  await updateDoc(doc(db, "tasks", taskId), {
    title: taskData.title.trim(),
    description: taskData.description.trim(),
    status: taskData.status,
  });
};

export const updateTaskStatus = async (taskId, status) => {
  await updateDoc(doc(db, "tasks", taskId), {
    status,
  });
};

export const removeTask = async (taskId) => {
  await deleteDoc(doc(db, "tasks", taskId));
};
