import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const productsCollection = collection(db, "products");

function formatProduct(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

function normalizeProduct(product) {
  return {
    name: String(product.name || "").trim(),
    category: String(product.category || "").trim(),
    price: Number(product.price),
    quantity: Number(product.quantity),
    description: String(product.description || "").trim(),
    imageUrl: String(product.imageUrl || "").trim(),
    status: product.status === "Inactive" ? "Inactive" : "Active",
  };
}

export async function getProducts() {
  const productsQuery = query(productsCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(productsQuery);
  return snapshot.docs.map(formatProduct);
}

export async function createProduct(product) {
  const payload = normalizeProduct(product);
  const docRef = await addDoc(productsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
  });
  const snapshot = await getDoc(docRef);
  return formatProduct(snapshot);
}

export async function updateProduct(id, product) {
  const payload = normalizeProduct(product);
  const docRef = doc(db, "products", id);

  await updateDoc(docRef, payload);

  const snapshot = await getDoc(docRef);
  return formatProduct(snapshot);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}
